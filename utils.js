import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image,Linking,ToastAndroid } from "react-native";
import * as clipboard from 'expo-clipboard';
import AsyncStorage from "@react-native-async-storage/async-storage";


export async function getFaviconAndTitle(url){

    const favicon =  `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16`;

    let title = url.replace("http://","");
    title = url.replace("https://","");


    const splitted =title.split(".");


   
    if(splitted.length == 2){
        // primo livello
        title = splitted[0];
    }else{
        let subdomain;

        if(splitted[0] == "www"){
            subdomain = splitted[1];
        }else{
            subdomain = splitted[0]
        }
        title = splitted.at(-2);
        title = title + " " + subdomain;
        // if(splitted[0].toString().trim() === "www"){
        //     title = splitted[1]
        // }else{
           
        //     // secondo livello
        // }
    }


    

    return {
        title:title,
        favicon:favicon
    }
    

}


export function openDialog(codeType, body, lastcode, setCodeFoundDialogVisible,setCodeFoundDialogData, favicon=null){


    setCodeFoundDialogData({
        title:codeType == "QR" ? "Codice QR":"Codice a barre",
        body:body,
        headerIcon:()=> codeType == "QR" ? <Ionicons style={{margin:5}} size={24} name="qr-code"/>:<MaterialCommunityIcons style={{margin:5}}  size={24} name="barcode"/>,
        icon:()=>codeType == "QR" ? <Image width={30} height={30} source={{uri:favicon}}/> : null,
        action:{
            title:codeType == "QR" ? "Vai al sito":"Copia",
            onPress:async()=>{
                if(codeType == "QR"){
                    Linking.openURL(lastcode);
                }else{
                    await clipboard.setStringAsync(lastcode);
                    let copied = await clipboard.getStringAsync();
                    ToastAndroid.show(
                        `${copied} copiato negli appunti`,
                        ToastAndroid.SHORT
                    );
                }
            }
        }
    });

    setCodeFoundDialogVisible(true);

}

// storage

export async function save(key,payload){
    const parsed = JSON.stringify(payload);
    await AsyncStorage.setItem(key,parsed)
}


export async function cancel(id){
    await AsyncStorage.removeItem(String(id));
}


export async function find(id){
    return new Promise((resolve,reject)=>{
        getAll().then(all=>{
            const found = all.find(x=>x.id == id);
            resolve(found);
        })
    })
}

export async function getAll(){
    let found = [];
    return new Promise((resolve,reject)=>{
        AsyncStorage.getAllKeys().then(async (keys)=>{
            for(let key of keys){
                const f = await AsyncStorage.getItem(key);
                found.push(JSON.parse(f));
            }
            resolve(found);
        })
    });
}


export async function drop(){
    await AsyncStorage.clear();
}