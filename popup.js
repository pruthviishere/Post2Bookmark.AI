import { getData } from '../background/dataStorage.js';

document.addEventListener('DOMContentLoaded', () => {
    const categoriesDropdown = document.getElementById("categories");
    const titlesList = document.getElementById("titles");

    const data = getData();

    // Populate categories
    const categories = [...new Set(data.map(item => item.category))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoriesDropdown.appendChild(option);
    });

    // Update titles when category changes
    categoriesDropdown.addEventListener("change", () => {
        const selectedCategory = categoriesDropdown.value;
        const filteredTitles = data.filter(item => item.category === selectedCategory);

        titlesList.innerHTML = "";
        filteredTitles.forEach(item => {
            const li = document.createElement("li");
            const link = document.createElement("a");
            link.href = item.link;
            link.textContent = item.title;
            link.target = "_blank";
            li.appendChild(link);
            titlesList.appendChild(li);
        });
    });
});
