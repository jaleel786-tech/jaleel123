// நூல்களின் தரவுத்தளம் - இது ஒரு வரிசை (array) ஆகும்
let booksDB = [
    { id: 1, title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', genre: 'Programming' },
    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Software Development' },
    { id: 3, title: 'Design Patterns', author: 'Erich Gamma', genre: 'Computer Science' }
];

// HTML உறுப்புகளை தேர்ந்தெடுக்கிறோம்
const bookForm = document.getElementById('bookForm');
const bookTableBody = document.getElementById('bookTableBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// தற்போது திருத்தப்படும் நூலின் ID
let currentEditId = null;

// ஆப்ஸை துவக்கும் செயல்பாடு
function init() {
    renderBookTable(booksDB);  // நூல் அட்டவணையை வரையவும்
    setupEventListeners();     // இவென்ட் லிஸ்டனர்களை அமைக்கவும்
}

// இவென்ட் லிஸ்டனர்களை அமைக்கும் செயல்பாடு
function setupEventListeners() {
    bookForm.addEventListener('submit', handleFormSubmit);  // படிவம் சமர்ப்பிக்கப்படும் போது
    searchBtn.addEventListener('click', handleSearch);     // தேடு பொத்தானை கிளிக் செய்யும் போது
}

// படிவம் சமர்ப்பிக்கப்படும் போது செயல்படும் செயல்பாடு
function handleFormSubmit(e) {
    e.preventDefault();  // பக்கத்தை ரீலோட் செய்யாமல் தடுக்கிறோம்
    
    // படிவத்திலிருந்து மதிப்புகளை எடுக்கிறோம்
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    
    if (currentEditId) {
        // ஏற்கனவே உள்ள நூலை புதுப்பிக்கிறோம்
        const bookIndex = booksDB.findIndex(book => book.id === currentEditId);
        if (bookIndex !== -1) {
            booksDB[bookIndex] = {
                id: currentEditId,
                title,
                author,
                genre
            };
        }
        currentEditId = null;
        document.querySelector('#bookForm button').textContent = 'Add Book';
    } else {
        // புதிய நூலை சேர்க்கிறோம்
        const newId = booksDB.length > 0 ? Math.max(...booksDB.map(book => book.id)) + 1 : 1;
        booksDB.push({
            id: newId,
            title,
            author,
            genre
        });
    }
    
    renderBookTable(booksDB);  // அட்டவணையை மீண்டும் வரையவும்
    bookForm.reset();          // படிவத்தை துடைக்கவும்
}

// தேடல் செயல்பாடு
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm) {
        renderBookTable(booksDB);
        return;
    }
    
    // தேடல் வார்த்தையுடன் பொருந்தும் நூல்களை வடிகட்டுகிறோம்
    const filteredBooks = booksDB.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm) ||
        book.genre.toLowerCase().includes(searchTerm)
    );
    
    renderBookTable(filteredBooks);
}

// நூல் அட்டவணையை வரையும் செயல்பாடு
function renderBookTable(books) {
    bookTableBody.innerHTML = '';  // அட்டவணையை காலி செய்கிறோம்
    
    if (books.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5">No books found</td>';
        bookTableBody.appendChild(row);
        return;
    }
    
    // ஒவ்வொரு நூலுக்கும் அட்டவணை வரிசையை உருவாக்குகிற
