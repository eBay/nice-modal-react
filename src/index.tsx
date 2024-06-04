/* *********************************************************
 * Copyright 2021 eBay Inc.

 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
*********************************************************** */

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module NiceModal
 * */

import { 
  useEffect, 
  useCallback, 
  useContext, 
  useReducer, 
  useMemo, 
  createContext, 
  FC, 
  Dispatch, 
  ReactNode, 
  ComponentProps, 
  ComponentType, 
  JSXElementConstructor 
} from 'react';

export interface NiceModalState {
  id: string;
  args?: Record<string, unknown>;
  visible?: boolean;
  delayVisible?: boolean;
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

/**
 * The handler to manage a modal returned by {@link useModal | useModal} hook.
 */
export interface NiceModalHandler<Props = Record<string, unknown>> extends NiceModalState {
  /**
   * Whether a modal is visible, it's controlled by {@link NiceModalHandler.show | show}/{@link NiceModalHandler.hide | hide} method.
   */
  visible: boolean;
  /**
   * If you don't want to remove the modal from the tree after hide when using helpers, set it to true.
   */
  keepMounted: boolean;
  /**
   * Show the modal, it will change {@link NiceModalHandler.visible | visible} state to true.
   * @param args - an object passed to modal component as props.
   */
  show: (args?: Props) => Promise<unknown>;
  /**
   * Hide the modal, it will change {@link NiceModalHandler.visible | visible} state to false.
   */
  hide: () => Promise<unknown>;
  /**
   * Resolve the promise returned by {@link NiceModalHandler.show | show} method.
   */
  resolve: (args?: unknown) => void;
  /**
   * Reject the promise returned by {@link NiceModalHandler.show | show} method.
   */
  reject: (args?: unknown) => void;
  /**
   * Remove the modal component from React component tree. It improves performance compared to just making a modal invisible.
   */
  remove: () => void;

  /**
   * Resolve the promise returned by {@link NiceModalHandler.hide | hide} method.
   */
  resolveHide: (args?: unknown) => void;
}

// Omit will not work if extends Record<string, unknown>, which is not needed here
export interface NiceModalHocProps {
  id: string;
  defaultVisible?: boolean;
  keepMounted?: boolean;
}
const symModalId = Symbol('NiceModalId');
const initialState: NiceModalStore = {};
const DEFAULT_DISPATCH = () => {
  throw new Error('No dispatch method detected, did you embed your app with NiceModal.Provider?');
};
export const NiceModalContext = createContext<NiceModalStore>(initialState);
export const DispatchContext = createContext<Dispatch<NiceModalAction>>(DEFAULT_DISPATCH);
const NiceModalIdContext = createContext<string | null>(null);
const MODAL_REGISTRY: {
  [id: string]: {
    comp: FC<any>;
    props?: Record<string, unknown>;
  };
} = {};
const ALREADY_MOUNTED: Record<string, boolean> = {};
const getUid = () => `_nice_modal_${uidSeed++}`;
let uidSeed = 0;
/**
 * @deprecated We will deprecate this API because it encounters reference errors in nested provider scenarios.
 * @see useModal()
 */
let deprecated_dispatch: Dispatch<NiceModalAction> = DEFAULT_DISPATCH;

// Modal reducer used in useReducer hook.
export const reducer = (
  state: NiceModalStore = initialState,
  action: NiceModalAction,
): NiceModalStore => {
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
          // There is logic inside HOC wrapper to make it visible after its first mount.
          // This mechanism ensures the entering transition.
          visible: !!ALREADY_MOUNTED[modalId],
          delayVisible: !ALREADY_MOUNTED[modalId],
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

// Get modal component by modal id
function getModal(modalId: string): FC<any> | undefined {
  return MODAL_REGISTRY[modalId]?.comp;
}

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
const hideModalCallbacks: NiceModalCallbacks = {};
const getModalId = (modal: string | FC<any>): string => {
  if (typeof modal === 'string') return modal as string;
  if (!modal[symModalId]) {
    modal[symModalId] = getUid();
  }
  return modal[symModalId];
};

type NiceModalArgs<T> = T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
  ? ComponentProps<T>
  : Record<string, unknown>;

export function show<T extends any, C extends any, P extends Partial<NiceModalArgs<FC<C>>>>(
  modal: FC<C>,
  args?: P,
  dispatch?: Dispatch<NiceModalAction>,
): Promise<T>;

export function show<T extends any>(modal: string, args?: Record<string, unknown>, dispatch?: Dispatch<NiceModalAction>): Promise<T>;
export function show<T extends any, P extends any>(modal: string, args: P, dispatch?: Dispatch<NiceModalAction>): Promise<T>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function show(
  modal: FC<any> | string,
  args?: NiceModalArgs<FC<any>> | Record<string, unknown>,
  dispatch?: Dispatch<NiceModalAction>
) {
  const modalId = getModalId(modal);
  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal as FC);
  }

  (dispatch || deprecated_dispatch)(showModal(modalId, args));
  if (!modalCallbacks[modalId]) {
    // `!` tell ts that theResolve will be written before it is used
    let theResolve!: (args?: unknown) => void;
    // `!` tell ts that theResolve will be written before it is used
    let theReject!: (args?: unknown) => void;
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve;
      theReject = reject;
    });
    modalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    };
  }
  return modalCallbacks[modalId].promise;
}

export function hide<T>(modal: string | FC<any>, dispatch?: Dispatch<NiceModalAction>): Promise<T>;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function hide(modal: string | FC<any>, dispatch?: Dispatch<NiceModalAction>) {
  const modalId = getModalId(modal);
  (dispatch || deprecated_dispatch)(hideModal(modalId));
  // Should also delete the callback for modal.resolve #35
  delete modalCallbacks[modalId];
  if (!hideModalCallbacks[modalId]) {
    // `!` tell ts that theResolve will be written before it is used
    let theResolve!: (args?: unknown) => void;
    // `!` tell ts that theResolve will be written before it is used
    let theReject!: (args?: unknown) => void;
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve;
      theReject = reject;
    });
    hideModalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    };
  }
  return hideModalCallbacks[modalId].promise;
}

export const remove = (modal: string | FC<any>, dispatch?: Dispatch<NiceModalAction>): void => {
  const modalId = getModalId(modal);

  (dispatch || deprecated_dispatch)(removeModal(modalId));
  delete modalCallbacks[modalId];
  delete hideModalCallbacks[modalId];
};

const setFlags = (modalId: string, flags: Record<string, unknown>): void => {
  deprecated_dispatch(setModalFlags(modalId, flags));
};
export function useModal(): NiceModalHandler;
export function useModal(modal: string, args?: Record<string, unknown>): NiceModalHandler;
export function useModal<C extends any, P extends Partial<NiceModalArgs<FC<C>>>>(
  modal: FC<C>,
  args?: P,
): Omit<NiceModalHandler, 'show'> & {
  show: (args?: P) => Promise<unknown>;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useModal(modal?: any, args?: any): any {
  const modals = useContext(NiceModalContext);
  const dispatch = useContext(DispatchContext);
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
      register(mid, modal as FC, args);
    }
  }, [isUseComponent, mid, modal, args]);

  const modalInfo = modals[mid];

  const showCallback = useCallback((args?: Record<string, unknown>) => show(mid, args, dispatch), [mid]);
  const hideCallback = useCallback(() => hide(mid, dispatch), [mid]);
  const removeCallback = useCallback(() => remove(mid, dispatch), [mid]);
  const resolveCallback = useCallback(
    (args?: unknown) => {
      modalCallbacks[mid]?.resolve(args);
      delete modalCallbacks[mid];
    },
    [mid],
  );
  const rejectCallback = useCallback(
    (args?: unknown) => {
      modalCallbacks[mid]?.reject(args);
      delete modalCallbacks[mid];
    },
    [mid],
  );
  const resolveHide = useCallback(
    (args?: unknown) => {
      hideModalCallbacks[mid]?.resolve(args);
      delete hideModalCallbacks[mid];
    },
    [mid],
  );

  return useMemo(
    () => ({
      id: mid,
      args: modalInfo?.args,
      visible: !!modalInfo?.visible,
      keepMounted: !!modalInfo?.keepMounted,
      show: showCallback,
      hide: hideCallback,
      remove: removeCallback,
      resolve: resolveCallback,
      reject: rejectCallback,
      resolveHide,
    }),
    [
      mid,
      modalInfo?.args,
      modalInfo?.visible,
      modalInfo?.keepMounted,
      showCallback,
      hideCallback,
      removeCallback,
      resolveCallback,
      rejectCallback,
      resolveHide,
    ],
  );
}
export const create = <P extends {}>(
  Comp: ComponentType<P>,
): FC<P & NiceModalHocProps> => {
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
    }, [id, show, defaultVisible]);

    useEffect(() => {
      if (keepMounted) setFlags(id, { keepMounted: true });
    }, [id, keepMounted]);

    const delayVisible = modals[id]?.delayVisible;
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
export const register = <T extends FC<any>>(
  id: string,
  comp: T,
  props?: Partial<NiceModalArgs<T>>,
): void => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props };
  } else {
    MODAL_REGISTRY[id].props = props;
  }
};

/**
 * Unregister a modal.
 * @param id - The id of the modal.
 */
export const unregister = (id: string): void => {
  delete MODAL_REGISTRY[id];
};

// The placeholder component is used to auto render modals when call modal.show()
// When modal.show() is called, it means there've been modal info
const NiceModalPlaceholder: FC = () => {
  const modals = useContext(NiceModalContext);
  const visibleModalIds = Object.keys(modals).filter((id) => !!modals[id]);
  visibleModalIds.forEach((id) => {
    if (!MODAL_REGISTRY[id] && !ALREADY_MOUNTED[id]) {
      console.warn(
        `No modal found for id: ${id}. Please check the id or if it is registered or declared via JSX.`,
      );
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

const InnerContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, dispatch] = useReducer(reducer, initialState);

  deprecated_dispatch = dispatch;

  return (
    <NiceModalContext.Provider value={modals}>
      <DispatchContext.Provider value={dispatch}>
        {children}
        <NiceModalPlaceholder />
      </DispatchContext.Provider>
    </NiceModalContext.Provider>
  );
};

export const Provider: FC<{
  children: ReactNode,
  modals?: NiceModalStore,
  dispatch?: Dispatch<NiceModalAction>,
  [key: string]: unknown,
}> = ({
  children,
  dispatch: givenDispatch,
  modals: givenModals,
}) => {
  if (!givenDispatch || !givenModals) {
    return <InnerContextProvider>{children}</InnerContextProvider>;
  }

  deprecated_dispatch = givenDispatch;

  return (
    <NiceModalContext.Provider value={givenModals}>
      <DispatchContext.Provider value={givenDispatch}>
        {children}
        <NiceModalPlaceholder />
      </DispatchContext.Provider>
    </NiceModalContext.Provider>
  );
};

/**
 * Declarative way to register a modal.
 * @param id - The id of the modal.
 * @param component - The modal Component.
 * @returns
 */
export const ModalDef: FC<{
  id: string,
  component: FC<any>,
}> = ({
  id,
  component,
}) => {
  useEffect(() => {
    register(id, component);
    return () => {
      unregister(id);
    };
  }, [id, component]);
  return null;
};

/**
 * A place holder allows to bind props to a modal.
 * It assigns show/hide methods to handler object to show/hide the modal.
 *
 * Comparing to use the <MyNiceModal id=../> directly, this approach allows use registered modal id to find the modal component.
 * Also it avoids to create unique id for MyNiceModal.
 *
 * @param modal - The modal id registered or a modal component.
 * @param handler - The handler object to control the modal.
 * @returns
 */
export const ModalHolder: FC<{
  modal: string | FC<any>;
  handler: any;
  [key: string]: unknown;
}> = ({
  modal,
  handler = {},
  ...restProps
}) => {
  const mid = useMemo(() => getUid(), []);
  const ModalComp = typeof modal === 'string' ? MODAL_REGISTRY[modal]?.comp : modal;

  if (!handler) {
    throw new Error('No handler found in NiceModal.ModalHolder.');
  }
  if (!ModalComp) {
    throw new Error(`No modal found for id: ${modal} in NiceModal.ModalHolder.`);
  }
  handler.show = useCallback((args: any) => show(mid, args), [mid]);
  handler.hide = useCallback(() => hide(mid), [mid]);

  return <ModalComp id={mid} {...restProps} />;
};

export const antdModal = (
  modal: NiceModalHandler,
): { visible: boolean; onCancel: () => void; onOk: () => void; afterClose: () => void } => {
  return {
    visible: modal.visible,
    onOk: () => modal.hide(),
    onCancel: () => modal.hide(),
    afterClose: () => {
      // Need to resolve before remove
      modal.resolveHide();
      if (!modal.keepMounted) modal.remove();
    },
  };
};
export const antdModalV5 = (
  modal: NiceModalHandler,
): { open: boolean; onCancel: () => void; onOk: () => void; afterClose: () => void } => {
  const { onOk, onCancel, afterClose } = antdModal(modal);
  return {
    open: modal.visible,
    onOk,
    onCancel,
    afterClose,
  };
};
export const antdDrawer = (
  modal: NiceModalHandler,
): { visible: boolean; onClose: () => void; afterVisibleChange: (visible: boolean) => void } => {
  return {
    visible: modal.visible,
    onClose: () => modal.hide(),
    afterVisibleChange: (v: boolean) => {
      if (!v) {
        modal.resolveHide();
      }
      !v && !modal.keepMounted && modal.remove();
    },
  };
};
export const antdDrawerV5 = (
  modal: NiceModalHandler,
): { open: boolean; onClose: () => void; afterOpenChange: (visible: boolean) => void } => {
  const { onClose, afterVisibleChange: afterOpenChange } = antdDrawer(modal);
  return {
    open: modal.visible,
    onClose,
    afterOpenChange,
  };
};
export const muiDialog = (
  modal: NiceModalHandler,
): { open: boolean; onClose: () => void; onExited: () => void } => {
  return {
    open: modal.visible,
    onClose: () => modal.hide(),
    onExited: () => {
      modal.resolveHide();
      !modal.keepMounted && modal.remove();
    },
  };
};

export const muiDialogV5 = (
  modal: NiceModalHandler,
): { open: boolean; onClose: () => void; TransitionProps: { onExited: () => void } } => {
  return {
    open: modal.visible,
    onClose: () => modal.hide(),
    TransitionProps: {
      onExited: () => {
        modal.resolveHide();
        !modal.keepMounted && modal.remove();
      },
    },
  };
};
export const bootstrapDialog = (
  modal: NiceModalHandler,
): { show: boolean; onHide: () => void; onExited: () => void } => {
  return {
    show: modal.visible,
    onHide: () => modal.hide(),
    onExited: () => {
      modal.resolveHide();
      !modal.keepMounted && modal.remove();
    },
  };
};

const NiceModal = {
  Provider,
  ModalDef,
  ModalHolder,
  NiceModalContext,
  create,
  register,
  getModal,
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

export default NiceModal;