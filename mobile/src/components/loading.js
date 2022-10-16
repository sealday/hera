import { ActivityIndicator, StyleSheet, View } from "react-native"

const Loading = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator style={styles.loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    loading: {
        color: '#000',
    },
})

export { Loading }