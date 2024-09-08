import axios from "axios";
import { GraphQLContext } from "./_types";

const instance = axios.create({
  baseURL: process.env.YU_GI_OH_API_URL,
});

export default async function contextFactory(): Promise<GraphQLContext> {
  return {
    axios: instance,
  };
}
