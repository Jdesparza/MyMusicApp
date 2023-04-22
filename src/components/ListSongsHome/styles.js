import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { COLOR_PRIMARY, COLOR_QUATERNARY, COLOR_SECONDARY, COLOR_TERTIARY, } from '../../utils/paleta';

const { width, height } = Dimensions.get('window')

const HEIGHT_ITEM = 55

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'rgba(250, 250, 250, 1)',
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    itemContainer: {
        flex: 1,
        height: HEIGHT_ITEM,
        flexDirection: 'row',
        backgroundColor: COLOR_QUATERNARY,
        marginTop: 7,
        overflow: 'hidden',
        marginHorizontal: 10,
        // borderRadius: 30, // 13
        borderTopLeftRadius: HEIGHT_ITEM,
        borderBottomLeftRadius: HEIGHT_ITEM
    },
    itemImg: {
        width: HEIGHT_ITEM,
        height: '100%',
        borderTopRightRadius: HEIGHT_ITEM,
        borderBottomRightRadius: HEIGHT_ITEM,
        resizeMode: 'cover'
    },
    infoSongsCont: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingRight: 15,
        paddingVertical: 7
    },
    title: {
        color: COLOR_PRIMARY,
        fontSize: 15,
        fontWeight: '500'
    },
    artist: {
        color: COLOR_SECONDARY,
        fontSize: 12,

    }
})

export default styles;