const { Schema, model, Types } = require("mongoose");

const tagSchema = new Schema({
	name: {
		type: String,
		unique:true,
		required: true,
	},
	problems: [
		{
			type: Schema.Types.ObjectID,
			ref: "Problem",
		},
	],
	articles: [
		{
			type: Schema.Types.ObjectID,
			ref: "Blog",
		},
	],
});

module.exports = model("Tag", tagSchema);