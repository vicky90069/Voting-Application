const express = require("express");
const router = express.Router();
const candidate = require("../models/candidate"); // Changed to `person`
const { jwtAuthMiddleware, generateToken } = require("../jwt");

// Corrected the syntax and added async keyword
const checkAdminRole = async (userId) => {
  try {
    const user = await user.findById(userId); // Corrected to findById
    return user.role === 'admin';
  } catch (error) {
    console.error(error);
    return false;
  }
}

router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!await checkAdminRole(req.user.id)) { // Changed to await checkAdminRole
      return res.status(403).json({ error: 'User does not have admin role' });
    }
    const data = req.body;
    const newCandidate = new candidate(data); // Corrected variable name to newCandidate
    const response = await newCandidate.save();
    console.log("Data saved");
    res.status(200).json({ response: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ error: 'User does not have admin role' });
    }
    const candidateId = req.params.candidateID;
    const updatedCandidateData = req.body;
    const response = await candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
      new: true,
      runValidators: true,
    });
    if (!response) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    console.log('Candidate data updated');
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => { // Changed to delete
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ error: 'User does not have admin role' });
    }
    const candidateId = req.params.candidateID;
    const response = await candidate.findByIdAndDelete(candidateId);
    if (!response) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    console.log('Candidate data deleted');
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});


// let's start voting
router.get('/vote/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    // no admin can vote
    // user can only vote once
    
    candidateID = req.params.candidateID;
    userId = req.user.id;

    try{
        // Find the Candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await user.findById(userid);
        if(!user){
            res.status(404).json({message:"user not found"});
        }
        if(user.isVoted){
         res.status(404).json({message:"Ypu have already voted"});
        }
        if(user.role=='voter'){
            res.status(404).json({message:"admin not allowed"})
        }

         // Update the Candidate document to record the vote
         candidate.votes.push({user: userId})
         candidate.totalVotes++;
         await candidate.save();
 
         // update the user document
         user.isVoted = true
         await user.save();
 
         return res.status(200).json({ message: 'Vote recorded successfully' });
     }catch(err){
         console.log(err);
         return res.status(500).json({error: 'Internal Server Error'});
     }
 });

 // vote count 
router.get('/vote/count', async (req, res) => {
    try{
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'name party -_id');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
