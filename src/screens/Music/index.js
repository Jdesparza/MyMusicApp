import { View, Text, ContextCompat, Image, FlatList } from 'react-native'
import React, { useState } from 'react'
import styles from './styles'
import MediaMeta from "rn-media-meta";

import RNFS from 'react-native-fs';
import { checkMultiple, PERMISSIONS, requestMultiple } from 'react-native-permissions';
import ListSongsHome from '../../components/ListSongsHome';

const MusicScreen = () => {
    return (
        <View style={styles.main}>
            <ListSongsHome />
        </View>
    )
}

export default MusicScreen