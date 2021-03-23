import React, { useRef } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Header from "./header";

export const Welcome = () => {
  return (
    <View style={Styles.Welcome}>
      <Text
        style={{
          fontWeight: "bold",
          color: "rgb(111, 113, 116)",
          fontSize: 20,
          marginLeft: "7%",
        }}
      >
        Welcome!
      </Text>
    </View>
  );
};

export const SubmitButton: React.FC<{ text: string; Submit: () => void }> = ({
  text,
  Submit,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={Styles.SubmitButton}
      onPress={Submit}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#ff5B2D",
          paddingVertical: 17,
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface InputPROPS {
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "number-pad";
  value: string | undefined;
  ChangeValue: (text: string) => void;
  ChangeFocus?: () => void;
  ref_: any;
  returnKeyType?: "next";
}

export const InputFeilds: React.FC<InputPROPS> = (props) => {
  return (
    <TextInput
      spellCheck={false}
      blurOnSubmit={true}
      style={Styles.Inputs}
      value={props.value}
      onChangeText={(text: string) => props.ChangeValue(text)}
      onSubmitEditing={props.ChangeFocus}
      {...props}
      ref={props.ref_}
    />
  );
};

const ForgotPassword = () => {
  return (
    <View
      style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 14.2, color: "#ff5B2D" }}>
        Forgot Password?
      </Text>
    </View>
  );
};

const DesignCircle: React.FC<{
  width: number;
  height: number;
  color: string;
  bottom: number;
  left?: number;
  right?: number;
}> = (props) => {
  return (
    <View
      style={{
        ...props,
        borderRadius: props.width / 2,
        position: "absolute",
        backgroundColor: props.color,
      }}
    />
  );
};

interface LOGINPROPS {
  username: string;
  password: string;
  ChangeUsername: (text: string) => void;
  ChangePassword: (text: string) => void;
  Submit: () => void;
}

const Login: React.FC<LOGINPROPS> = (props) => {
  const UserRef = useRef(null);
  const PasswordRef = useRef(null);
  return (
    <KeyboardAvoidingView
      style={Styles.LoginContainer}
      keyboardVerticalOffset={50}
    >
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Header text="Login" />
      <ScrollView>
        <Welcome />
        <InputFeilds
          ref_={UserRef}
          value={props.username}
          ChangeValue={props.ChangeUsername}
          placeholder="Username"
          returnKeyType="next"
          // @ts-ignore
          ChangeFocus={() => PasswordRef.current.focus()}
        />
        <InputFeilds
          ref_={PasswordRef}
          value={props.password}
          ChangeValue={props.ChangePassword}
          placeholder="Password"
          secureTextEntry={true}
        />
        <SubmitButton text="Login" Submit={props.Submit} />
        <ForgotPassword />
      </ScrollView>
      <DesignCircle
        width={250}
        height={250}
        color="#FFDDD4"
        bottom={-150}
        right={-150}
      />
      <DesignCircle
        width={150}
        height={150}
        color="#FFBDAB"
        bottom={-80}
        left={-80}
      />
    </KeyboardAvoidingView>
  );
};

const Styles = StyleSheet.create({
  LoginContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  Welcome: {
    marginTop: 20,
    paddingVertical: 5,
    marginBottom: 10,
  },

  Inputs: {
    backgroundColor: "#EDEDF1",
    paddingVertical: 15,
    paddingHorizontal: "5%",
    borderRadius: 15,
    marginHorizontal: "5%",
    width: "90%",
    marginVertical: 5,
  },

  SubmitButton: {
    marginHorizontal: "5%",
    width: "90%",
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default Login;