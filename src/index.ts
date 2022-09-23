import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { showErrorMessage } from '@jupyterlab/apputils';
import { PageConfig } from '@jupyterlab/coreutils';
import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import {
  NotebookPanel,
  INotebookModel,
} from '@jupyterlab/notebook';
import { IDisposable, DisposableDelegate } from '@lumino/disposable';

// const backendURL = 'http://192.168.1.100:5000';
// const frontendURL = 'http://192.168.1.100:5420';
const backendURL = 'https://api.jupyterspot.com';
const frontendURL = 'https://jupyterspot.com';
let apiKey = "";

/**
 * Adds a notebook to JupyterSpot.
 */
 async function addNotebook(panel: NotebookPanel, apiKey: string) {
  
  // get the open dialog and set it's content to `msg`
  function setMsg(msg: string) {
    const dialogs = document.getElementsByClassName("jp-Dialog");
    if (dialogs.length > 0) {
      const dialog = dialogs[0];
      const msgDiv = dialog.getElementsByClassName("jp-Dialog-body")[0];
      msgDiv.innerHTML = msg;
    } else {
      console.log("JupyterSpot: no open dialog found");
    }
  }

  if (!apiKey) {
    showErrorMessage("Your JupyterSpot API key has not been set.", 
      "Get your API key by going to https://jupyterspot.com/account, then add it to " + 
      "JupyterLab by going to Settings -> Advanced Settings Editor -> JupyterSpot " + 
      "and updating the API_KEY setting."
    );
    return;
  }

  // get JSON notebook representation from the panel
  if (!panel.content.model) {
    showErrorMessage("Notebook has no content, can't add it to JupyterSpot.", "");
    return;
  }
  
  const nb_json = JSON.stringify(panel.content.model.toJSON(), null);

  // TODO: handle Windows paths
  const nb_path =
    PageConfig.getOption('serverRoot') + '/' + panel.context.localPath;

  const requestUrl = backendURL + '/api/v1/convert-nb-from-json-ext';
  console.info('JupyterSpot requestUrl:', requestUrl);

  const fd = new FormData();
  fd.append('nb_json', nb_json);
  fd.append('api_key', apiKey);
  fd.append('path', nb_path);

  showErrorMessage("Adding notebook to JupyterSpot...", "");

  await fetch(requestUrl, {
    method: 'post',
    body: fd,
  })
  .then((res) => res.json())
  .then((res) => {
    console.log('JupyterSpot result:', res);
    if (res.success) {
      const url = frontendURL + '/notebook?id=' + res.id;
      window.open(url);
      setMsg(
        "Added notebook to JupyterSpot successfully.  " +
        "If a new tab didn't open, give your browser permission to open popups from JupyterLab. " +
        "The URL for your notebook whiteboard is: <a href='" + url + "' target='_blank'>" + url + "</a>"
      );
      console.info('JupyterSpot notebook url: ', url);
    } else {
      setMsg('Error adding notebook to JupyterSpot: ' + res.msg);
    }
    return res;
  })
  .catch((error) => {
    console.log('JupyterSpot error:', error);
    setMsg('Error adding the notebook to JupyterSpot: ' + error.toString());
    return error;
  });
}


/**
 * A notebook widget extension that adds the open notebook to JupyterSpot.
 */
 export class ButtonExtension
 implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
 /**
  * Create a new extension for the notebook panel widget.
  *
  * @param panel Notebook panel
  * @param context Notebook context
  * @returns Disposable on the added button
  */
 createNew(
   panel: NotebookPanel,
   context: DocumentRegistry.IContext<INotebookModel>
 ): IDisposable {
   const button = new ToolbarButton({
     className: 'upload-button',
     label: 'Open in JupyterSpot',
     tooltip: 'Open in JupyterSpot',
     pressedTooltip: 'Adding notebook to JupyterSpot',
     disabledTooltip: 'Adding notebook to JupyterSpot...',
     enabled: true,
     pressed: false,
     onClick: () => addNotebook(panel, apiKey),
   });

   panel.toolbar.insertItem(10, 'openInJupyterSpot', button);
   return new DisposableDelegate(() => {
     button.dispose();
   });
 }
}

/**
 * Initialization data for the jupyterspot extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterspot:plugin',
  autoStart: true,
  requires: [ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    settings: ISettingRegistry,
    ) => {
    console.log('JupyterSpot extension activated');

    // add the button
    app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
    
    /**
     * Load the settings for this extension
     *
     * @param setting Extension settings
     */
    function loadSetting(setting: ISettingRegistry.ISettings): void {
      // Read the settings and convert to the correct type
      apiKey = setting.get('API_KEY').composite as string;
      if (apiKey) {
        console.log("JupyterSpot apiKey is set");
      } else {
        console.log("JupyterSpot apiKey is NOT set");
      }
    }
    
    // Wait for the application to be restored and
    // for the settings for this plugin to be loaded
    Promise.all([app.restored, settings.load(plugin.id)])
    .then(([, setting]) => {
      // Read the settings
      loadSetting(setting);

      // Listen for your plugin setting changes using Signal
      setting.changed.connect(loadSetting);
    })
    .catch((reason) => {
      console.error(
        `Something went wrong when reading the settings.\n${reason}`
      );
    });
  }
};

export default plugin;
