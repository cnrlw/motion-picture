import React, { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

export default function TumblrPosts(props) {
    const [posts, setPosts] = useState([])
    const [currentPostIndex, setCurrentPostIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isPlaying, setIsPlaying] = useState(true)

    useEffect(() => {
        const apiKey = "GY2wTKzLkzn2nUXRw1ne6yKVvYTLTsHNui8lNNHvv9Lhgllgap"
        const blogIdentifier = props.text + ".tumblr.com"
        const limit = props.number
        const apiUrl = `https://api.tumblr.com/v2/blog/${blogIdentifier}/posts?api_key=${apiKey}&limit=${limit}`

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                setPosts(data.response.posts)
                setIsLoading(false)
            })
            .catch((error) => console.error(error))
    }, [])

    useEffect(() => {
        if (isPlaying) {
            const id = setInterval(() => {
                setCurrentPostIndex((prevIndex) =>
                    prevIndex === posts.length - 1 ? 0 : prevIndex + 1
                )
            }, 250)
            return () => clearInterval(id)
        }
    }, [posts, isPlaying, currentPostIndex])

    const handleClick = (event) => {
        const viewportWidth = window.innerWidth
        const clickPosition = event.clientX

        if (clickPosition < viewportWidth / 3) {
            setCurrentPostIndex((prevIndex) =>
                prevIndex === 0 ? posts.length - 1 : prevIndex - 1
            )
            setIsPlaying(false)
        } else if (clickPosition > (2 * viewportWidth) / 3) {
            setCurrentPostIndex((prevIndex) =>
                prevIndex === posts.length - 1 ? 0 : prevIndex + 1
            )
            setIsPlaying(false)
        } else {
            setIsPlaying(!isPlaying)
        }
    }

    const handleMouseMove = (event) => {
        const viewportWidth = window.innerWidth
        const hoverPosition = event.clientX

        if (hoverPosition < viewportWidth / 3) {
            document.body.style.cursor = "w-resize"
        } else if (
            hoverPosition > viewportWidth / 3 &&
            hoverPosition < (2 * viewportWidth) / 3
        ) {
            document.body.style.cursor = isPlaying ? "grabbing" : "grab"
        } else {
            document.body.style.cursor = "e-resize"
        }
    }

    const handleMouseLeave = () => {
        document.body.style.cursor = "default"
    }

    return (
        <div
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ height: "100vh" }}
        >
            {isLoading ? (
                <p
                    style={{
                        color: props.color,
                        margin: "16px 8px",
                    }}
                >
                    Loading visuals...
                </p>
            ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {posts.map((post, index) => (
                        <li
                            key={post.id}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }}
                        >
                            {post.photos && post.photos.length > 0 && (
                                <img
                                    src={post.photos[0].original_size.url}
                                    alt={post.summary}
                                    style={{
                                        opacity:
                                            index === currentPostIndex ? 1 : 0,
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        transition: "opacity 0.05s ease-in-out",
                                    }}
                                />
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
TumblrPosts.defaultProps = {
    text: "buildingjournal",
    color: "#318448",
    number: 5,
}

addPropertyControls(TumblrPosts, {
    text: {
        type: ControlType.String,
        title: "Tumblr Name",
        description:
            "Enter the first part of the URL of the Tumblr blog you want to grab images from.",
        defaultValue: "buildingjournal",
    },
    color: {
        type: ControlType.Color,
        title: "Text Colour",
        defaultValue: "318448",
    },
    number: {
        type: ControlType.Number,
        title: "count",
        defaultValue: "5",
    },
})
