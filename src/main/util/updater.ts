import { remote } from 'electron';
import axios from 'axios';
import * as config from '../../config/update';
import { app_name, pathToInstaller, updateRefreshRate } from '../../config/update';
import { platform } from 'os';
import { ensureDir, writeFile } from 'fs-extra';
import * as path from 'path';
import { spawnAsync } from './index';
import { store } from '../../renderer/store';
import { setDownloadPercentage, setServerLatestVersion } from '../../renderer/store/module/updater/action';
import { spawn } from "child_process"
import { setPath } from '../../renderer/store/module/router/action';
const { app, dialog } = remote;


const getPlatform = (): 'windows' | 'linux' | undefined => {
    let plat: any;
    if (platform() === 'win32') plat = 'windows';
    else if (platform() === 'linux') plat = 'linux';
    return plat;
};

export function getVersion() {
    return process.env.NODE_ENV === 'production'
        ? app.getVersion()
        : process.env.npm_package_version as string;
}

export async function checkUpdate() {


    const version = getVersion();

    const plat = getPlatform();


    const call = await axios.get(`${config.updateServer}${config.app_name}/${plat}/version/`);

    store.dispatch(setServerLatestVersion(call.data));

    const current = version.split('.').map(x => parseInt(x));
    const server = call.data.split('.').map((x: string) => parseInt(x));


    if (server[0] > current[0] || server[1] > current[1] || server[2] > current[2]) {

        const response = await dialog.showMessageBox({ title: 'Update', message: 'A new version is available', buttons: ['Download', 'Cancel'] });

        if (response.response === 0) {
            store.dispatch(setPath('Updater'));
            await downloadUpdate();

            const response = await dialog.showMessageBox({ title: 'Update', message: 'Application is ready to update', buttons: ['Install', 'Cancel'] });
            if (response.response === 0) {
                await installUpdate();
            }


        } else {
            console.debug('User does not want to update');
        }
    } else {
        console.debug('You are running on the latest version');
    }

    setTimeout(checkUpdate, updateRefreshRate);
}


export async function downloadUpdate() {
    const plat = getPlatform();
    const bin = await axios.get(`${config.updateServer}${config.app_name}/${plat}`, {
        responseType: 'arraybuffer',
        onDownloadProgress: progressEvent => {
            store.dispatch(setDownloadPercentage(progressEvent.loaded * 100 / progressEvent.total));
        }
    });
    const data = new Buffer(bin.data);
    await ensureDir(path.dirname(pathToInstaller));
    await writeFile(pathToInstaller, data);
    return pathToInstaller;
}


export async function installUpdate() {
    const filename = path.basename(pathToInstaller);
    const dir = path.dirname(pathToInstaller);
    spawn(filename, {detached: true, windowsHide: true})
    app.quit();
}
