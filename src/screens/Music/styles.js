import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'rgba(250, 250, 250, 1)',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
})

export default styles;