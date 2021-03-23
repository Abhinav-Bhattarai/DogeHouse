import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "./header";
import { InputFeilds, SubmitButton, Welcome } from "./login";

const DesignCircle: React.FC<{
  width: number;
  height: number;
  color: string;
  top: number;
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

interface PROPS {
  username: string;
  password: string;
  confirm: string;
  phone: string;
  ChangeUsername: (text: string) => void;
  ChangePassword: (text: string) => void;
  ChangeConfirm: (text: string) => void;
  ChangePhone: (text: string) => void;
  Submit: () => void;
}

const Signup: React.FC<PROPS> = (props) => {
  const UsernameRef = useRef(null);
  const PasswordRef = useRef(null);
  const ConfirmRef = useRef(null);
  const PhoneRef = useRef(null);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={100}
      style={Styles.SignupContainer}
    >
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Header text="Signup" />
      <ScrollView>
        <Welcome />
        <InputFeilds
          placeholder="Username"
          value={props.username}
          ChangeValue={props.ChangeUsername}
          ref_={UsernameRef}
          returnKeyType="next"
          // @ts-ignore
          ChangeFocus={() => PasswordRef.current.focus()}
        />
        <InputFeilds
          placeholder="Password"
          secureTextEntry={true}
          value={props.password}
          ChangeValue={props.ChangePassword}
          ref_={PasswordRef}
          returnKeyType="next"
          // @ts-ignore
          ChangeFocus={() => ConfirmRef.current.focus()}
        />
        <InputFeilds
          placeholder="Confirm"
          secureTextEntry={true}
          value={props.confirm}
          ChangeValue={props.ChangeConfirm}
          ref_={ConfirmRef}
          returnKeyType="next"
          // @ts-ignore
          ChangeFocus={() => PhoneRef.current.focus()}
        />
        <InputFeilds
          placeholder="Phone"
          keyboardType="number-pad"
          value={props.phone}
          ChangeValue={props.ChangePhone}
          ref_={PhoneRef}
        />
        <SubmitButton text="Signup" Submit={props.Submit}/>
      </ScrollView>
      <DesignCircle
        width={250}
        height={250}
        color="#FFDDD4"
        top={-150}
        right={-150}
      />
      <DesignCircle
        width={150}
        height={150}
        color="#FFBDAB"
        top={-80}
        left={-80}
      />
    </KeyboardAvoidingView>
  );
};

const Styles = StyleSheet.create({
  SignupContainer: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
});

export default Signup;