import { View, Text, ContextCompat, Image, FlatList } from 'react-native'
import React, { useState } from 'react'
import styles from './styles'
import MediaMeta from "rn-media-meta";

import RNFS from 'react-native-fs';
import { checkMultiple, PERMISSIONS, requestMultiple } from 'react-native-permissions';

const MusicScreen = () => {

    const [isPermission, setIsPermission] = useState(false)
    const [musicFilesInternal, setMusicFilesInternal] = useState([]);
    const [musicFilesExternal, setMusicFilesExternal] = useState([]);
    const [musicFilesT, setMusicFilesT] = useState([]);


    const [isMusicList, setIsMusicList] = useState(0)
    const [musicInfo, setMusicInfo] = useState([]);


    const requestMultiplePermisssion = () => {
        if (Platform.OS === 'android') {
            requestMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then((response) => {
                // console.log(response)

                if (
                    response[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'granted' &&
                    response[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted'
                ) {
                    console.log('granted')
                    setIsPermission(true)
                } else {
                    console.log('denegado')
                    setIsPermission(false)
                }
            })
        }
    }

    const searchMusicFiles = async (folderPath, musicFiles) => {
        const files = await RNFS.readDir(folderPath);
        await Promise.all(
            files.map(async file => {
                if (file.isDirectory()) {
                    if (file.name === 'Android') { // Ignorar la carpeta "Android"
                        return;
                    }
                    await searchMusicFiles(file.path, musicFiles);
                    // console.log(file.path)
                } else {
                    const extension = file.name.split('.').pop();
                    if (extension === 'mp3' || extension === 'wav' || extension === 'm4a') {
                        musicFiles.push(file.path);
                        // console.log('MUSICA =>=>=>=>=>=>=>=> : ', file.path)
                    }
                }
            })
        );
        return musicFiles;
    };

    const accesMemory = (pathExternal) => {
        const paths = [RNFS.ExternalStorageDirectoryPath, pathExternal]

        paths.forEach((element, index) => {
            searchMusicFiles(element, [])
                .then(musicFiles => {
                    // index === 0 ? setMusicFilesInternal(musicFiles) : setMusicFilesExternal(musicFiles)
                    setMusicFilesInternal(currentMusic => currentMusic.concat(musicFiles))
                    // console.log('\n\n\nMusic files in internal storage:', musicFiles);
                });
        })
    }

    const splitPath = (path) => {
        let pathFinish = '/'
        path.split('/').forEach((element, index) => {
            if (element != '' && index <= 2) {
                pathFinish += element + '/'
            }
        });

        return (pathFinish)
    }

    const getSDcard = async () => {

        const storageInternal = splitPath(RNFS.ExternalStorageDirectoryPath);
        let storageExternal = []
        // console.log('Almacenamiento Interno: ', storageInternal)

        if (Platform.OS === "android") {
            const paths = (await RNFS.getAllExternalFilesDirs()).filter(
                (path) => {
                    storageExternal.push(splitPath(path))
                }
            );
        }
        storageExternal.forEach(element => {
            if (element != storageInternal) {
                accesMemory(element)
            }
        })
    }

    React.useEffect(() => {
        if (!isPermission) requestMultiplePermisssion()
        if (isPermission) {
            getSDcard()
        }
    }, [isPermission])

    React.useEffect(() => {
        console.log('Busqueda Musica Alm. Interno: ', musicFilesInternal.length)
        if (musicFilesInternal.length != 0 && musicFilesInternal.length > 100 && isMusicList === 0) {
            setIsMusicList(isMusicList => isMusicList + 1)
            for (let i = 0; i < 100; i++) {
                MediaMeta.get(musicFilesInternal[i])
                    .then(metadata => setMusicInfo(music => music.concat(metadata)))
                    .catch(err => console.error(err));
            }
        }
    }, [musicFilesInternal])

    // React.useEffect(() => {
    //     console.log('Busqueda Musica Alm. Externo: ', musicFilesExternal)
    // }, [musicFilesExternal])

    return (
        <View style={styles.main}>
            {musicInfo.length != 0 && (
                <FlatList
                    data={musicInfo}
                    keyExtractor={(item, index) => item.thumb}
                    renderItem={({ item }) => {
                        console.log(item.title)
                        return (
                            <Image
                                style={{ width: 100, height: 100 }}
                                source={{ uri: `data:image/png;base64,${item.thumb}` }}
                            />
                        )
                    }}
                    numColumns={3}
                />
            )}
        </View>
    )
}

export default MusicScreen