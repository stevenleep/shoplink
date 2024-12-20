import { Controller, Get, Res } from "routing-controllers";

@Controller("/users")
export class UserController {
    @Get("/")
    getAll() {
        return "This action returns all users";
    }

    @Get("/:id")
    getOne(@Res() response: any) {
        return response.json({ id: 1, name: "John Doe" });
    }
}
