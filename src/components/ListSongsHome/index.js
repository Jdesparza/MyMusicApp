import { View, Text, ContextCompat, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import styles from './styles'
import MediaMeta from "rn-media-meta";

import RNFS from 'react-native-fs';
import { checkMultiple, PERMISSIONS, requestMultiple } from 'react-native-permissions';
import repositorySongs from '../../data/repositorySongs';

import Entypo from 'react-native-vector-icons/Entypo'
import { COLOR_PRIMARY } from '../../utils/paleta';

const ListSongsHome = () => {

    const [isPermission, setIsPermission] = useState(false)
    const [musicFiles, setMusicFiles] = useState([]);
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
                    if (file.name === 'Android' || file.name === 'Voice Recorder') { // Ignorar la carpeta "Android"
                        return;
                    }
                    await searchMusicFiles(file.path, musicFiles);
                    // console.log(file.path)
                } else {
                    const extension = file.name.split('.').pop();
                    if (extension === 'mp3' || extension === 'wav' || extension === 'm4a') {
                        musicFiles.push(file.path);
                        await MediaMeta.get(file.path)
                            .then(metadata => setMusicInfo(music => music.concat({ path: file.path, info: metadata })))
                            .catch(err => console.error(err));
                        // console.log('MUSICA =>=>=>=>=>=>=>=> : ', file.path)
                        // console.log(musicInfo)
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
                    setMusicFiles(currentMusic => currentMusic.concat(musicFiles))
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

    useEffect(() => {
        if (!isPermission) requestMultiplePermisssion()
        if (isPermission && musicFiles.length === 0) {
            getSDcard()
        }
    }, [isPermission])

    useEffect(() => {
        console.log('Busqueda Musica: ', musicFiles.length)
    }, [musicFiles])


    return (
        <View style={styles.main}>
            {musicInfo.length != 0 && (
                <FlatList
                    data={musicInfo}
                    initialNumToRender={musicInfo.length}
                    keyExtractor={(item, index) => item.path}
                    // keyExtractor={(item, index) => item.id}
                    renderItem={({ item }) => {
                        if (item.info.thumb === '' || item.info.thumb === undefined || item.info.thumb === null) console.log(item)
                        return (
                            <TouchableOpacity style={styles.itemContainer} onPress={() => console.warn(item.info.title)}>
                                <Image
                                    style={styles.itemImg}
                                    source={
                                        (item.info.thumb === '' || item.info.thumb === undefined || item.info.thumb === null) ?
                                            require('../../assets/images/music.jpg')
                                            :
                                            { uri: `data:image/png;base64,${item.info.thumb}` }
                                    }
                                />
                                <View style={styles.infoSongsCont}>
                                    <Text style={styles.title} numberOfLines={1}>{item.info.title}</Text>
                                    <Text style={styles.artist} numberOfLines={1}>{item.info.artist}</Text>
                                </View>
                                <View style={styles.menuCont}>
                                    <TouchableOpacity style={styles.touchIcon} onPress={() => console.error('Menú: ', item.info.title)}>
                                        <Entypo name='dots-three-vertical' size={20} color={COLOR_PRIMARY} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    // numColumns={3}
                    onEndReachedThreshold={0.3}
                    showsVerticalScrollIndicator={false}
                // maxToRenderPerBatch={15}
                />
            )}
        </View>
    )
}

export default ListSongsHome