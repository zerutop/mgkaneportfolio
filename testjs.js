document.documentElement.classList.add("js-enabled");

const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(function(entries, observer){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 })
    : null;

function observeReveal(element){
    if(!element){
        return;
    }

    element.classList.add("reveal");
    if(revealObserver){
        revealObserver.observe(element);
    }else{
        element.classList.add("is-visible");
    }
}

document.querySelectorAll(".profile-card, .my-skills > h1, .my-skills > p, .skill-card, .contact > h1, .contact > p, .contact-card, .model-card").forEach(observeReveal);

const themeToggle = document.getElementById("theme-toggle");
let savedTheme = null;

try{
    savedTheme = localStorage.getItem("theme");
}catch(error){
    savedTheme = null;
}

function updateThemeButton(isDarkMode){
    if(!themeToggle){
        return;
    }

    themeToggle.setAttribute("aria-pressed", isDarkMode);
    themeToggle.setAttribute("aria-label", isDarkMode ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.title = isDarkMode ? "Switch to light mode" : "Switch to dark mode";
}

if(themeToggle && savedTheme === "dark"){
    document.body.classList.add("dark-mode");
    updateThemeButton(true);
}

if(themeToggle){
    themeToggle.addEventListener("click", function(){
        document.body.classList.toggle("dark-mode");
        document.body.classList.remove("theme-changing");
        void document.body.offsetWidth;
        document.body.classList.add("theme-changing");

        const isDarkMode = document.body.classList.contains("dark-mode");
        updateThemeButton(isDarkMode);
        try{
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        }catch(error){
            // The theme still works when browser storage is unavailable.
        }

        window.setTimeout(function(){
            document.body.classList.remove("theme-changing");
        }, 450);
    });
}

const viewWorkButton = document.getElementById("view-work-button");
const showcaseLink = document.querySelector('nav a[href="#showcase"]');
const showcaseSection = document.getElementById("showcase");
const closeShowcaseButton = document.getElementById("close-showcase");
const projectGrid = document.getElementById("project-grid");
const projectTemplate = document.getElementById("project-card-template");
const projects = [
    {
        tag: "Roblox",
        title: "Myanmar Fantasy Game",
        description: "A Roblox game that I created to practice my Luau scripting and Roblox development skills.",
        image: "Myanmarfantasy.png",
        imageAlt: "Myanmar Fantasy Game preview",
        link: "https://www.roblox.com/games/109481281933426/Myanmar-Fantasy-Game"
    },
    {
        tag: "Roblox",
        title: "Mandalay Palace 👑 (Roleplay)",
        description: "A Roblox roleplay game where I practice Luau scripting and 3D modeling.",
        image: "Mandalaypalce.jpg",
        imageAlt: "Mandalay Palace preview",
        link: "https://www.roblox.com/games/83069944741571/Mandalay-Palaceskills"
    },
    {
        tag: "Roblox",
        title: "Myanmar Water Festival Bash",
        description: "A Roblox game to practice my Luau scripting and UI development skills.",
        image: "Waterfestival.jpg",
        imageAlt: "Myanmar Water Festival Bash preview",
        link: "https://www.roblox.com/games/12649095253/Myanmar-Water-Festival-Bash"
    },
    {
        tag: "Roblox",
        title: "Steal A Myanmar BrainRots",
        description: "A Roblox game featuring Myanmar-inspired characters, environments, and progression gameplay.",
        image: "BrainRot.jpg",
        imageAlt: "Steal A Myanmar BrainRots preview",
        link: "https://www.roblox.com/games/125142594458417/Steal-A-Myanmar-BrainRots"
    },
    {
        tag: "Roblox",
        title: "Food Obby Game",
        description: "This game is still in development while I practice Luau scripting and Roblox game design.",
        image: "ObbyGame.png",
        imageAlt: "Roblox practice project preview",
        link: "#skills"
    }
];

function isSafeProjectLink(link){
    if(typeof link !== "string"){
        return false;
    }

    if(link.startsWith("#")){
        return /^#[A-Za-z][\w:-]*$/.test(link);
    }

    try{
        const url = new URL(link);
        return url.protocol === "https:";
    }catch(error){
        return false;
    }
}

function buildProjectCards(){
    if(!projectGrid || !projectTemplate){
        return;
    }

    if(projectGrid.children.length > 0){
        return;
    }

    projects.forEach(function(project, index){
        const projectCard = projectTemplate.content.firstElementChild.cloneNode(true);
        const projectImage = projectCard.querySelector(".project-image");
        const projectTag = projectCard.querySelector(".project-tag");
        const projectTitle = projectCard.querySelector(".project-title");
        const projectDescription = projectCard.querySelector(".project-description");
        const projectLink = projectCard.querySelector(".project-link");

        if(project.image){
            projectImage.src = project.image;
            projectImage.alt = project.imageAlt;
            projectImage.loading = "lazy";
            projectImage.decoding = "async";
        }else{
            projectImage.remove();
            projectCard.classList.add("project-card-no-image");
        }

        projectTag.textContent = project.tag;
        projectTitle.textContent = project.title;
        projectDescription.textContent = project.description;
        if(!isSafeProjectLink(project.link)){
            projectLink.remove();
        }else{
            projectLink.href = project.link;

            if(project.link.startsWith("#")){
                projectLink.removeAttribute("target");
                projectLink.removeAttribute("rel");
            }else{
                projectLink.target = "_blank";
                projectLink.rel = "noopener noreferrer";
            }
        }

        projectGrid.appendChild(projectCard);
        observeReveal(projectCard);

        setTimeout(function(){
            projectCard.classList.add("show");
        }, index * 80);
    });
}

function showProjects(event){
    if(event){
        event.preventDefault();
    }

    if(!showcaseSection){
        return;
    }

    showcaseSection.hidden = false;
    buildProjectCards();

    showcaseSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

if(viewWorkButton && showcaseSection && projectGrid && projectTemplate){
    viewWorkButton.addEventListener("click", showProjects);
}

if(showcaseLink && showcaseSection && projectGrid && projectTemplate){
    showcaseLink.addEventListener("click", showProjects);
}

if(closeShowcaseButton && showcaseSection){
    closeShowcaseButton.addEventListener("click", function(){
        showcaseSection.hidden = true;
        if(viewWorkButton){
            viewWorkButton.focus();
        }
    });
}

const imageViewer = document.getElementById("image-viewer");
const imageViewerImage = document.getElementById("image-viewer-image");
const imageViewerCaption = document.getElementById("image-viewer-caption");
const imageViewerClose = document.getElementById("image-viewer-close");
const modelViewButtons = document.querySelectorAll(".model-view-button");

modelViewButtons.forEach(function(button){
    button.addEventListener("click", function(){
        const image = button.querySelector("img");
        const modelCard = button.closest(".model-card");
        const caption = modelCard ? modelCard.querySelector("figcaption") : null;

        if(!imageViewer || !imageViewerImage || !imageViewerCaption || !image){
            return;
        }

        imageViewerImage.src = image.src;
        imageViewerImage.alt = image.alt;
        imageViewerCaption.textContent = caption ? caption.textContent : image.alt;
        imageViewer.showModal();
    });
});

if(imageViewerClose && imageViewer){
    imageViewerClose.addEventListener("click", function(){
        imageViewer.close();
    });

    imageViewer.addEventListener("click", function(event){
        if(event.target === imageViewer){
            imageViewer.close();
        }
    });

    imageViewer.addEventListener("close", function(){
        imageViewerImage.removeAttribute("src");
        imageViewerImage.alt = "";
        imageViewerCaption.textContent = "";
    });
}
