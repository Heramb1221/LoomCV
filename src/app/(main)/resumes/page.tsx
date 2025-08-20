import prisma from "@/lib/prisma"
import { resumeDataInclude } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"
import { Metadata } from "next"
import ResumeItem from "./ResumeItem"
import CreateResumeButton from "./CreateResumeButton"

export const metadata: Metadata = {
    title: "Your Resume"
}

export default async function Page() {
    const {userId} = await auth();

    if(!userId) {
        return null;
    }

    const [resumes, totalCount] = await Promise.all([
        prisma.resume.findMany({
            where: {
                userId
            },
            orderBy: {
                updatedAt: "desc"
            },
            include: resumeDataInclude
        }),
        prisma.resume.count({
            where: {
                userId
            }
        })
    ])


    return (
        <main className="max-w-7xl mx-auto w-full px-3 py-6 space-y-6">
            <CreateResumeButton canCreate={totalCount < 3} />

            <div className="space-y-1">
                <h1 className="text-3xl font-bold">Your resumes</h1>
                <p>Total: {totalCount}</p>
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 lg: grid-cols-4 w-full gap-3">
                {resumes.map(resume => (
                    <ResumeItem 
                        key={resume.id} resume={resume}
                    />
                ))}
            </div>
        </main>
    ) 
}