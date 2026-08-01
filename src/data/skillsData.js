import Pc from '../assets/icon/Pc.svg';
import Iphone from '../assets/icon/Iphone.svg';

export const skillsData = [
    {
        id: "web-development",
        icon: Pc,
        title: "Web Development",
        description:
            "Building modern, responsive web applications with clean and maintainable code.",
        skills: [
            {
                label: "HTML, CSS, JavaScript",
                value: 85,
            },
            {
                label: "React and Tailwind CSS",
                value: 70,
            },
            {
                label: "Responsive layouts",
                value: 85,
            },
            {
                label: "Performance-focused builds",
                value: 75,
            },
        ],
    },
    {
        id: "ios-development",
        icon: Iphone,
        title: "iOS Development",
        description:
            "Building native iOS interfaces with a focus on usability and responsiveness.",
        skills: [
            {
                label: "Swift/Swift UI",
                value: 80,
            },
            {
                label: "UIKit-based interfaces",
                value: 75,
            },
            {
                label: "App lifecycle & optimization",
                value: 70,
            },
            {
                label: "Clean architecture principles",
                value: 80,
            },
        ],
    },
];
