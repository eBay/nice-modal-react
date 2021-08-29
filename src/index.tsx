/* *********************************************************
 * Copyright 2021 eBay Inc.

 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
*********************************************************** */

/**
 * @module NiceModal
 * */

import React, { useEffect, useMemo, useContext, useReducer, ReactNode } from 'react';

interface NiceModalState {
  id: string;
  args?: Record<string, unknown>;
  visible?: boolean;
  deplayVisible?: boolean;
  keepMounted?: boolean;
}

export interface NiceModalStore {
  [key: string]: NiceModalState;
}

export interface NiceModalAction {
  type: string;
  payload: {
    modalId: string;
    args?: Record<string, unknown>;
    flags?: Record<string, unknown>;
  };
}
interface NiceModalCallbacks {
  [modalId: string]: {
    resolve: (args: unknown) => void;
    reject: (args: unknown) => void;
    promise: Promise<unknown>;
  };
}

export interface NiceModalHandler extends NiceModalState {
  visible: boolean;
  keepMounted: boolean;
  show: (args?: unknown) => Promise<unknown>;
  hide: (args?: unknown) => void;
  remove: () => void;
}

export interface NiceModalHocProps {
  id: string;
  defaultVisible?: boolean;
  keepMounted?: boolean;
}
const symModalId = Symbol('NiceModalId');
const initialState: NiceModalStore = {};
const NiceModalContext = React.createContext<NiceModalStore>(initialState);
const NiceModalIdContext = React.createContext<string | null>(null);
const MODAL_REGISTRY: {
  [id: string]: {
    comp: React.FC<NiceModalHocProps & Record<string, unknown>>;
    props?: Record<string, unknown>;
  };
} = {};
const ALREADY_MOUNTED = {};

let uidSeed = 0;
let dispatch: React.Dispatch<NiceModalAction>;
const getUid = () => `_nice_modal_${uidSeed++}`;

// Modal reducer used in useReducer hook.
export const reducer = (state: NiceModalStore = initialState, action: NiceModalAction): NiceModalStore => {
  switch (action.type) {
    case 'nice-modal/show': {
      const { modalId, args } = action.payload;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          id: modalId,
          args,
          // If modal is not mounted, mount it first then make it visible.
          // There is logic inside HOC wrapper to make it visible after its frist mount.
          // This mechanism ensures the entering transition.
          visible: !!ALREADY_MOUNTED[modalId],
          deplayVisible: !ALREADY_MOUNTED[modalId],
        },
      };
    }
    case 'nice-modal/hide': {
      const { modalId } = action.payload;
      if (!state[modalId]) return state;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          visible: false,
        },
      };
    }
    case 'nice-modal/remove': {
      const { modalId } = action.payload;
      const newState = { ...state };
      delete newState[modalId];
      return newState;
    }
    case 'nice-modal/set-flags': {
      const { modalId, flags } = action.payload;
      return {
        ...state,
        [modalId]: {
          ...state[modalId],
          ...flags,
        },
      };
    }
    default:
      return state;
  }
};

// action creator to show a modal
function showModal(modalId: string, args?: Record<string, unknown>): NiceModalAction {
  return {
    type: 'nice-modal/show',
    payload: {
      modalId,
      args,
    },
  };
}

// action creator to set flags of a modal
function setModalFlags(modalId: string, flags: Record<string, unknown>): NiceModalAction {
  return {
    type: 'nice-modal/set-flags',
    payload: {
      modalId,
      flags,
    },
  };
}
// action creator to hide a modal
function hideModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/hide',
    payload: {
      modalId,
    },
  };
}

// action creator to remove a modal
function removeModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/remove',
    payload: {
      modalId,
    },
  };
}

const modalCallbacks: NiceModalCallbacks = {};
const getModalId = (modal: string | React.FC): string => {
  if (typeof modal === 'string') return modal as string;
  if (!modal[symModalId]) {
    modal[symModalId] = getUid();
  }
  return modal[symModalId];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const show = (modal: string | React.FC<any>, args?: Record<string, unknown>): Promise<unknown> => {
  const modalId = getModalId(modal);
  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal as React.FC);
  }

  dispatch(showModal(modalId, args));
  if (!modalCallbacks[modalId]) {
    let theResolve;
    let theReject;
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve;
      theReject = reject;
    });
    // TODO: how to avoid below typescript ignore
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    modalCallbacks[modalId] = { resolve: theResolve, reject: theReject, promise };
  }
  return modalCallbacks[modalId].promise;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hide = (modal: string | React.FC<any>, args?: unknown): void => {
  const modalId = getModalId(modal);
  dispatch(hideModal(modalId));
  const callback = modalCallbacks[modalId];
  if (!(args instanceof Error) && callback?.resolve) {
    callback.resolve(args);
  } else if (args instanceof Error && callback?.reject) {
    callback.reject(args);
  }
  delete modalCallbacks[modalId];
};

export const remove = (modalId: string): void => {
  dispatch(removeModal(modalId));
  delete modalCallbacks[modalId];
};

const setFlags = (modalId: string, flags: Record<string, unknown>): void => {
  dispatch(setModalFlags(modalId, flags));
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseModalArgs = [] | [modalId: string] | [Comp: React.FC<any>, args?: Record<string, unknown>];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useModal = (...params: UseModalArgs): NiceModalHandler => {
  const modal = params[0];
  const args = params[1];
  const modals = useContext(NiceModalContext);
  const contextModalId = useContext(NiceModalIdContext);
  let modalId: string | null = null;
  const isUseComponent = modal && typeof modal !== 'string';
  if (!modal) {
    modalId = contextModalId;
  } else {
    modalId = getModalId(modal);
  }

  // Only if contextModalId doesn't exist
  if (!modalId) throw new Error('No modal id found in NiceModal.useModal.');

  const mid = modalId as string;
  // If use a component directly, register it.
  useEffect(() => {
    if (isUseComponent && !MODAL_REGISTRY[mid]) {
      register(mid, modal as React.FC, args);
    }
  }, [isUseComponent, mid, modal, args]);

  const modalInfo = modals[mid];

  return useMemo<NiceModalHandler>(
    () => ({
      id: mid,
      args: modalInfo?.args,
      visible: !!modalInfo?.visible,
      keepMounted: !!modalInfo?.keepMounted,
      show: (args?: Record<string, unknown>) => show(mid, args),
      hide: (args?: unknown) => hide(mid, args),
      remove: () => remove(mid),
    }),
    [mid, modalInfo],
  );
};
export const create = <P extends Record<string, unknown>>(
  Comp: React.ComponentType<P>,
): React.FC<P & NiceModalHocProps> => {
  return ({ defaultVisible, keepMounted, id, ...props }) => {
    const { args, show } = useModal(id);

    // If there's modal state, then should mount it.
    const modals = useContext(NiceModalContext);
    const shouldMount = !!modals[id];

    useEffect(() => {
      // If defaultVisible, show it after mounted.
      if (defaultVisible) {
        show();
      }

      ALREADY_MOUNTED[id] = true;

      return () => {
        delete ALREADY_MOUNTED[id];
      };
    }, [id]); //eslint-disable-line

    useEffect(() => {
      if (keepMounted) setFlags(id, { keepMounted: true });
    }, [id, keepMounted]);

    const delayVisible = modals[id]?.deplayVisible;
    // If modal.show is called
    //  1. If modal was mounted, should make it visible directly
    //  2. If modal has not been mounted, should mount it first, then make it visible
    useEffect(() => {
      if (delayVisible) {
        // delayVisible: false => true, it means the modal.show() is called, should show it.
        show(args);
      }
    }, [delayVisible, args, show]);

    if (!shouldMount) return null;
    return (
      <NiceModalIdContext.Provider value={id}>
        <Comp {...(props as P)} {...args} />
      </NiceModalIdContext.Provider>
    );
  };
};

// All registered modals will be rendered in modal placeholder
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const register = (id: string, comp: React.FC<any>, props?: Record<string, unknown>): void => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props };
  } else {
    MODAL_REGISTRY[id].props = props;
  }
};

// The placeholder component is used to auto render modals when call modal.show()
// When modal.show() is called, it means there've been modal info
const NiceModalPlaceholder: React.FC = () => {
  const modals = useContext(NiceModalContext);
  const visibleModalIds = Object.keys(modals).filter((id) => !!modals[id]);
  visibleModalIds.forEach((id) => {
    if (!MODAL_REGISTRY[id] && !ALREADY_MOUNTED[id]) {
      console.warn(`No modal found for id: ${id}. Please check the id or if it is registered or declared via JSX.`);
      return;
    }
  });

  const toRender = visibleModalIds
    .filter((id) => MODAL_REGISTRY[id])
    .map((id) => ({
      id,
      ...MODAL_REGISTRY[id],
    }));

  return (
    <>
      {toRender.map((t) => (
        <t.comp key={t.id} id={t.id} {...t.props} />
      ))}
    </>
  );
};

const InnerContextProvider: React.FC = ({ children }) => {
  const arr = useReducer(reducer, initialState);
  const modals = arr[0];
  dispatch = arr[1];
  return (
    <NiceModalContext.Provider value={modals}>
      {children}
      <NiceModalPlaceholder />
    </NiceModalContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Provider: React.FC<any> = ({
  children,
  dispatch: givenDispatch,
  modals: givenModals,
}: {
  children: ReactNode;
  dispatch?: React.Dispatch<NiceModalAction>;
  modals?: NiceModalStore;
}) => {
  if (!givenDispatch || !givenModals) {
    return <InnerContextProvider>{children}</InnerContextProvider>;
  }
  dispatch = givenDispatch;
  return (
    <NiceModalContext.Provider value={givenModals}>
      {children}
      <NiceModalPlaceholder />
    </NiceModalContext.Provider>
  );
};

export const antdModal = (
  modal: NiceModalHandler,
): { visible: boolean; onCancel: () => void; onOk: () => void; afterClose: () => void } => {
  return {
    visible: modal.visible,
    onOk: () => modal.hide(),
    onCancel: () => modal.hide(),
    afterClose: () => !modal.keepMounted && modal.remove(),
  };
};
export const antdDrawer = (
  modal: NiceModalHandler,
): { visible: boolean; onClose: () => void; afterVisibleChange: (visible: boolean) => void } => {
  return {
    visible: modal.visible,
    onClose: () => modal.hide(),
    afterVisibleChange: (v: boolean) => !v && !modal.keepMounted && modal.remove(),
  };
};
export const muiDialog = (modal: NiceModalHandler): { open: boolean; onClose: () => void; onExited: () => void } => {
  return {
    open: modal.visible,
    onClose: () => modal.hide(),
    onExited: () => !modal.keepMounted && modal.remove(),
  };
};
export const bootstrapDialog = (
  modal: NiceModalHandler,
): { show: boolean; onHide: () => void; onExited: () => void } => {
  return {
    show: modal.visible,
    onHide: () => modal.hide(),
    onExited: () => !modal.keepMounted && modal.remove(),
  };
};

export default {
  Provider,
  create,
  register,
  show,
  hide,
  remove,
  useModal,
  reducer,
  antdModal,
  antdDrawer,
  muiDialog,
  bootstrapDialog,
};
