

interface PageParams {
    params: {
        [key: string]: string
    }
}

const page = ({params}: PageParams) => {

    const { slug } = params

    return (
        <div>
            {slug}
        </div>
    )
}

export default page