import { db } from "@/db"
import { notFound } from "next/navigation"
import DesignConfigurator from "./DesignConfigurator"

// search params can be 0, 1 or more
interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const Page = async ({searchParams}: PageProps) => {
    // id retrieved from search params
    const {id} = searchParams
    // make db call
    if (!id || typeof id !== "string") {
        return notFound()
    }

    const configuration = await db.configuration.findUnique({
        where : { id }
    })

    if (!configuration) {
        return notFound()
    }

    const { imageUrl, width, height } = configuration
    
    // return <DesignConfigurator imageUrl={imageUrl} configId={id} imageDimensions={{width:width, height:height}} />
    return <DesignConfigurator
                imageUrl={imageUrl}
                configId={id}
                imageDimensions={{width, height}}
            />
}

export default Page