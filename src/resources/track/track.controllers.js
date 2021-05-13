const Track = require('./track.model');

exports.tracks = async (req,res)=>{
    let tracks;
    //console.log('hello',Track)
    try{
        tracks = await Track.find({});
    }catch(err){
        return res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
    }
    return res.status(200).json(tracks);
}

exports.track = ()=>{}

exports.createTrack = async (req,res)=>{
    const track = new Track(req.body);
    
    try{
        await track.save();
    }catch(err){
        return res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
    }
    return res.status(200).json(track);
}

exports.deleteTrack=()=>{}

exports.updateTrack = async (req,res)=>{
    const {id} = req.params;
    const {description,img_url,topics} = req.body;
    let track;
    try{
        track = await Track.findById(id);
    }catch(err){
        return res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
    }
    if(!track){
        return res.status(400).send({message : "no track with this id ..."})
    }
    try{
        if(description) track.description = description;
        if(img_url) track.img_url = img_url;
        if(topics) track.topics = track.topics.concat(topics);
        await track.save();
    }catch(err){
        return res.status(500).send({message : "Sorry we are facing an internal error please try again later ..."})
    }
    return res.status(201).json(track);
}