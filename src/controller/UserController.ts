import { Request, Response } from "express"
import { UserBusiness } from "../Business/UserBusiness"
import { UserDatabase } from "../database/UserDatabase"
import { User } from "../models/User"
import { UserDB } from "../types"

export class UserController {
    public getUsers = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined
    
            const userDatabase = new UserDatabase()
            const usersDB = await userDatabase.findUsers(q)
    
            const users: User[] = usersDB.map((userDB) => new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.created_at
            ))
    
            res.status(200).send(users)
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public createUser = async (req: Request, res: Response) => {
        //unicas responsabilidades da controller são: RECEBER REQUISIÇÃO E DEVOLVER RESPOSTA
        try {
            //RECEBENDO REQUISIÇÃO
            const input ={
                id:req.body.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }//modela input que é o que a business precisa


            //instancia business
            const userBusiness = new UserBusiness()

            //chama metodo da business correspondente(no caso createUser)
            const result = await userBusiness.createUser(input)//business pega o input

           //DEVOLVENDO RESPOSTA
            res.status(201).send(result)
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }
}