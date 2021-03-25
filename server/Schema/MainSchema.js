import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = require("graphql");
import RegisterModel from "../Models/register-model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const UserSchema = new GraphQLObjectType({
  name: "UserSchema",
  fields: () => {
    return {
      _id: {
        type: GraphQLString,
      },
      Username: {
        type: GraphQLString,
      },
      DogeAvailable: {
        type: GraphQLInt,
      },
    };
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    UserInfo: {
      type: UserSchema,
      args: {
        id: {
          type: GraphQLString,
        },
        auth_token: {
          type: GraphQLString,
        },
      },
      resolve: async (_, args) => {
        const { id, auth_token } = args;
        const response = await RegisterModel.findById(id);
        if (response !== null) {
          jwt.verify(auth_token, process.env.JWT_AUTH_TOKEN, (err, data) => {
            if (!err) {
              if (data.Username === response.Username) {
                const data = {
                  Username: response.Username,
                  DogeAvailable: response.DogeAvailable,
                };
                return data;
              }
            }
          });
        }
      },
    }
  },
});

const MainGQLSchema = new GraphQLSchema({
    query: RootQuery
});

export default MainGQLSchema;
