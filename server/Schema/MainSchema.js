import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLBoolean } = require("graphql");
import RegisterModel from "../Models/register-model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import TickerModel from '../Models/Ticker-model.js';
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

const TickerSchema = new GraphQLObjectType({
  name: 'TickerSchema',
  fields: () => {
    return {
      _id: {type: GraphQLString},
      Name: {type: GraphQLString},
      Ticker: {type: GraphQLString},
      High: {type: GraphQLInt},
      Low: {type: GraphQLInt},
      Volume: {type: GraphQLInt},
      OutstandingStocks: {type: GraphQLInt},
      CurrentTradingValue: {type: GraphQLInt},
      limit_reached: {type: GraphQLBoolean}
    }
  }
})

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
    },

    Stocks: {
      type: new GraphQLList(TickerSchema),
      args: {request_count: {type: GraphQLInt}},
      resolve: async(_, args) => {
        const { request_count } = args;
        const response = await TickerModel.find({}).skip(request_count).limit(request_count * 10);
        console.log(response);
        if(response.length !== 0) {
          if(response.length === 10){
            return {data: response, limit_reached: false}
          }
          return {data: response, limit_reached: true}
        }
      }
    },
    
    ShareInfo: {
      type: TickerSchema,
      args: {id: {type: GraphQLString}},
      resolve: async(_, args) => {
        const {id} = args;
        const response = await TickerModel.findById(id);
        if (response !== null) {
          return response
        }
        return
      }
    }

  },
});

const MainGQLSchema = new GraphQLSchema({
    query: RootQuery
});

export default MainGQLSchema;
