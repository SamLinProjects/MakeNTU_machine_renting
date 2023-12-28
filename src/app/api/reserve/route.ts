import React from "react";
import { PrismaClient } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    const { account, password, permission } = request.body;
    try {
        const user = await prisma.user.create({
            data: {
                account: account,
                password: password,
                permission: permission
            }
        });
        console.log(user);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            {status: 500}
        );
    }

    return NextResponse.json({ message: "User created" }, { status: 200});
}