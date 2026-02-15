import "dotenv/config";

import { connectDB } from "./db/index.js";
import { app } from "./app.js";

connectDB()
    .then(async () => {
        try {
            // Check if admin exists
            const { models } = await import("./admin/model.register.js");
            const adminExists = await models.Admin.findOne({ email: "admin@gmail.com" });

            if (!adminExists) {
                console.log("Creating default admin account...");
                await models.Admin.create({
                    name: "admin",
                    email: "admin@gmail.com",
                    password: "admin"
                });
                console.log("Default admin account created: admin@gmail.com / admin");
            }
        } catch (error) {
            console.error("Error creating default admin:", error);
        }

        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });
