import Pc from '../assets/icon/Pc.svg';
import Iphone from '../assets/icon/Iphone.svg';

export const skillsData = [
    {
        id: "web-development",
        icon: Pc,
        title: "skills.web.title",
        description:
            "skills.web.description",
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
                label: "skills.web.responsive",
                value: 85,
            },
            {
                label: "skills.web.performance",
                value: 75,
            },
        ],
    },
    {
        id: "ios-development",
        icon: Iphone,
        title: "skills.ios.title",
        description:
            "skills.ios.description",
        skills: [
            {
                label: "Swift/Swift UI",
                value: 80,
            },
            {
                label: "skills.ios.uikit",
                value: 75,
            },
            {
                label: "skills.ios.lifecycle",
                value: 70,
            },
            {
                label: "skills.ios.architecture",
                value: 80,
            },
        ],
    },
];
