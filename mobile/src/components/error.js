import { Text } from "@rneui/themed"
import { StyleSheet, View } from "react-native"

const Error = () => {
    return (
        <View style={styles.container}>
            <Text>出错了！</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
})

export { Error }