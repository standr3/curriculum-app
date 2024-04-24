const express = require('express')
const router = express.Router()
const commitsController = require('../controllers/commitsController')

router.route('/')
    .get(commitsController.getAllCommits)
    .post(commitsController.createNewCommit)
    .patch(commitsController.updateCommit)
    .delete(commitsController.deleteCommit)

module.exports = router