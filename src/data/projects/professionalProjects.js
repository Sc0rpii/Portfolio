import PetSittingAleImg from "../../assets/projects/professional/pet-sitting-ale.webp";

export const professionalProjects = [
    {
        id: "pet-sitting-ale",
        img: PetSittingAleImg,
        width: 1284,
        height: 881,
        title: "Pet Sitting Ale",
        description: "A modern landing page for a pet-sitting business focused on one goal: turning visitors into customers.",
        accurateDescription: "PetsittingAle is a website developed for a pet sitter with the aim of offering a modern, professional online presence geared towards converting visitors into new customers. The project was designed with a focus on user experience, loading speed, and usability on any device.\n\nThe landing page clearly presents the services offered, a photo gallery, a section dedicated to customer reviews, FAQs, and a final call-to-action that allows you to quickly contact the pet sitter via a dedicated form.\n\nTechnically, the project was developed using HTML5, Tailwind CSS, JavaScript, and PHP, with a focus on good development practices. The contact system uses PHPMailer for secure email sending via SMTP, avoiding the use of PHP's mail() function and ensuring greater reliability in message delivery.\n\nTo make the site easily manageable over time, a MariaDB-based review system has also been designed, allowing customers to submit a review via a dedicated form. Each review is initially saved as pending approval and can be moderated through an authentication-protected administrative area, from which you can approve, reject, or block content before posting to the site.\n\nSeveral security-related best practices were adopted during development, including client-side and server-side data validation, use of prepared queries (PDOs) to prevent SQL Injection, secure password management via hashing, credential protection using environment variables, and a framework designed to be easily extendable with new features.\n\nThis project represents an important step in my journey towards full-stack development, allowing me to integrate a modern frontend with a real backend, a database",
        url:"https://sc0rpii.github.io/PetsittingAle/"
    }
];
