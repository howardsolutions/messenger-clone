import { getCurrentUser } from "@/app/actions";
import { NextResponse } from "next/server";
import prismaClient from '@/libs/prismadb';

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();

        const { name, image } = body;

        if (!currentUser?.id) {
            return new NextResponse("unauthorized", { status: 401 })
        }

        const updatedUser = await prismaClient.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                name: name,
                image: image
            }
        });

        return NextResponse.json(updatedUser);

    } catch (err: any) {
        console.log(err, "SETTINGS_ERROR");
        return new NextResponse("Internal Server Error", { status: 500 })
    }

}