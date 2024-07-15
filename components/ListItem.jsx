import { List } from "react-native-paper";
import { Text, View, TouchableOpacity, Image } from "react-native";
import {
  EvilIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { cancel } from "../utils";

export default function ListItem({ x, updateList, onPress }) {
  let message = x?.type === "QR" ? "Sito web" : "Prodotto ricecato";
  let title = x?.type === "QR" ? x?.title : x?.payload;

  function Heading() {
    if (x?.type == "QR") {
      return x?.favicon ? (
        <Image
          style={{ width: 24, height: 24, margin: 5 }}
          source={{ uri: x?.favicon }}
        />
      ) : (
        <Ionicons
          style={{ margin: 5 }}
          name="qr-code"
          size={24}
          color="black"
        />
      );
    } else {
      return (
        <MaterialCommunityIcons
          name="barcode"
          color="black"
          size={24}
          style={{ margin: 5 }}
        />
      );
    }
  }


  function onItemCancel(){
    cancel(x?.id);
    updateList();
  }

  return (
    <List.Item
      onPress={onPress}
      description={message}
      descriptionStyle={{ color: "rgba(150,150,150,0.9)" }}
      title={title}
      right={() => {
        return (
          <View
          style={{
            width:"30%",
            display:"flex",
            flexDirection:"row",
            justifyContent:"space-between",
            alignItems:"center"
          }}
          >
            <Text>{x?.date}</Text>
            <TouchableOpacity
            onPress={onItemCancel}
            style={{position:"absolute",right:-10}}
            >
              <EvilIcons color="red" name="trash" size={24} />
            </TouchableOpacity>
          </View>
        );
      }}
      left={() => {
        return (
          <View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heading />
          </View>
        );
      }}
    />
  );
}
