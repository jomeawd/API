import * as usersService from '../services/users.service.js'

export const getUsers = (req, res) => {
    res.json({
        users: usersService.getUsers()
    })
}