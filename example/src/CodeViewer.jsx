/* eslint import/no-webpack-loader-syntax: off */

import React, { useEffect } from 'react';
import codeAntd from '!!raw-loader!./MyAntdModal.tsx';
import codeUserList from '!!raw-loader!./UserList.jsx';
import codeUserInfoModal from '!!raw-loader!./UserInfoModal.jsx';
import codePromiseSample from '!!raw-loader!./PromiseSample.jsx';
import codeMyMuiDialog from '!!raw-loader!./MyMuiDialog.tsx';
import codeMyBootstrapDialog from '!!raw-loader!./MyBootstrapDialog.tsx';
import codeReduxIntegration from '!!raw-loader!./ReduxIntegration.jsx';
import codeDeclarative from '!!raw-loader!./Declarative.jsx';

const codeMap = {
  'MyAntdModal.tsx': codeAntd,
  'UserInfoModal.jsx': codeUserInfoModal,
  'UserList.jsx': codeUserList,
  'PromiseSample.jsx': codePromiseSample,
  'MyMuiDialog.tsx': codeMyMuiDialog,
  'MyBootstrapDialog.tsx': codeMyBootstrapDialog,
  'ReduxIntegration.jsx': codeReduxIntegration,
  'Declarative.jsx': codeDeclarative,
};
export default function CodeViewer({ filename }) {
  useEffect(() => {
    window.Prism.highlightAll();
  }, [filename]);
  return (
    <div className="code-viewer">
      <h5>{filename}</h5>
      <pre>
        <code className="language-jsx line-numbers">
          {codeMap[filename] || `// Error: code of "${filename}" not found`}
        </code>
      </pre>
    </div>
  );
}
