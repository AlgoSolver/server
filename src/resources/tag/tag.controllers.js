const Tag =require('./tag.model');

exports.articles = async (req,res)=>{
	const {tag} = req.params;
	const page = req.query.page | 1;
	let articles;
	try{
		articles = await Tag.findOne({name:tag}).populate({
			path:'articles',
			model:'Blog',
			select:"author header createdAt tags",
			options:{
				limit:20,
				skip:(page - 1) * 20,
				sort:{
					createdAt:-1
				}
			},
			populate:{
				path:'author',
				select:"username role",
				model:"User",
			}
		})
	}catch(err){
		console.log(err);
		res.status(404).json({message:"Unkown error please try again later"});
	}	
	return res.json({articles:articles?.articles || []});
}
exports.problems = async ({req,res})=>{
	const {tag} = req.params;
	const page = req.query.page | 1;
	let problems;
	try{
		problems = await Tag.findOne({name:tag}).populate({
			path:'problems',
			model:'Blog',
			select:"author header createdAt tags",
			options:{
				limit:20,
				skip:(page - 1) * 20,
				sort:{
					createdAt:-1
				}
			},
			populate:{
				path:'author',
				select:"username role",
				model:"User",
			}
		})
	}catch(err){
		console.log(err);
		res.status(404).json({message:"Unkown error please try again later"});
	}	
	return res.json({problems:problems?.problems || []});
};
