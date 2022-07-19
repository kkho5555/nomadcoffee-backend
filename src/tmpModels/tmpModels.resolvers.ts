import client from "@/client";
export default {
	Query: {
		tmpModels: () => client.tmpModel.findMany(),
	},
};
