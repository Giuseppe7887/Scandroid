
import { Text,View, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";


function NeedPermission(){

    return(
      <View style={styles.main}>
        <TouchableOpacity style={styles.button}>
            <AntDesign name="camera" size={50} onPress={()=>Linking.openSettings()}/>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",marginTop:10}}>
                    <Text style={{marginRight:10}}>Permessi Fotocamera</Text>
                    <Ionicons name="open-outline" size={24} color="black"/>

                </View>
        </TouchableOpacity>
      </View>
    );
}


export default NeedPermission;

const styles = StyleSheet.create({
    main:{
        width:"100%",
        height:"100%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    button:{
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
    }
});