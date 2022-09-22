import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the jupyterspot extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterspot:plugin',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension jupyterspot is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('jupyterspot settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for jupyterspot.', reason);
        });
    }
  }
};

export default plugin;
