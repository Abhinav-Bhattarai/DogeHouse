import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLBoolean, GraphQLNonNull } = require("graphql");
import RegisterModel from "../Models/register-model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import TickerModel from '../Models/Ticker-model.js';
import PortfolioModel from '../Models/Portfolio.js';
dotenv.config();

const UserSchema = new GraphQLObjectType({
  name: "UserSchema",
  fields: () => {
    return {
      Dogecount: {type: GraphQLInt}
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
      DataSet: {type: GraphQLNonNull}
    }
  }
});

const PortfolioSchema = new GraphQLObjectType({
  name: 'PortfolioSchema',
  fields: () => {
    return {
      Portfolio: {type: GraphQLString}
    }
  }
})

const DummyStockSchema = new GraphQLObjectType({
  name: 'DummyStockSchema',
  fields: () => {
    return {
      data: {type: new GraphQLList(TickerSchema)},
      limit_reached: {type: GraphQLBoolean},
    }
  }
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
                return {Dogecount: response.DogeCount};
              }
            }
          });
        }
      },
    },

    Stocks: {
      type: DummyStockSchema,
      args: {request_count: {type: GraphQLInt}},
      resolve: async(_, args) => {
        const { request_count } = args;
        const response = await TickerModel.find({}).skip(request_count * 10).limit(10);
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
      }
    },

    PorfolioInfo: {
      type: PortfolioSchema,
      args: {UserID: {type: GraphQLString}},
      resolve: async(_, args) => {
        const { UserID } = args;
        const response = await PortfolioModel.find({ UserID });
        if (response !== null) {
          return {Portfolio: JSON.stringify(response[0].Portfolio)}
        }
      }
    }
  },
});

const MainGQLSchema = new GraphQLSchema({
    query: RootQuery
});

export default MainGQLSchema;