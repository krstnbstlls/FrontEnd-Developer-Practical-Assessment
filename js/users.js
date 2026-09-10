// navigation mobile
const hamburger = document.getElementById('hamburger');
const navigation = document.getElementById('navigation');

const filterToggleBtn = document.getElementById('filterToggleBtn');
const filterDropdownRow = document.getElementById('filterSelects');

const searchInput = document.querySelector('.filter-card input[type="text"]');

const filterContainer = document.getElementById('filterSelects');
const filterSelects = filterContainer ? filterContainer.querySelectorAll('.filter-dropdown') : [];

const clearFiltersBtn = document.querySelector('.clear-filters');
const tableRows = document.querySelectorAll('table tbody tr');
const tableBody = document.querySelector('table tbody');
const paginationInfo = document.querySelector('.pagination-info');

document.addEventListener('DOMContentLoaded', () => {
    // mobile navigation
    hamburger.addEventListener('click', () => {
        navigation.classList.toggle('open-nav');
    });

    // Toggle filter
    if (filterToggleBtn && filterDropdownRow) {
        filterToggleBtn.addEventListener('click', () => {
            filterDropdownRow.classList.toggle('d-none');
        });
    }

    // search function
    console.log("Found filters inside container:", filterSelects.length);

    function filterTable() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        // [0] = Status, [1] = Region, [2] = Division
        const statusFilter = filterSelects[0] ? filterSelects[0].value.toLowerCase() : 'all';
        const regionFilter = filterSelects[1] ? filterSelects[1].value.toLowerCase() : 'all';
        const divisionFilter = filterSelects[2] ? filterSelects[2].value.toLowerCase() : 'all';

        let visibleCount = 0;

        tableRows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 0) return;
            
            // 5: Division (NY, CA, TX)
            // 6: Region (Corporate, West, South)
            const divisionText = cells[5] ? cells[5].textContent.toLowerCase().trim() : '';
            const regionText = cells[6] ? cells[6].textContent.toLowerCase().trim() : '';

            // 1. Region match
            let matchesRegion = (regionFilter === 'all' || regionText === regionFilter);
            
            // 2. Division match
            let matchesDivision = (divisionFilter === 'all' || divisionText === divisionFilter);

            // 3. Status match
            let matchesStatus = (statusFilter === 'all');

            // 4. Search matching
            let matchesSearch = true;
            if (searchTerm !== '') {
                matchesSearch = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(searchTerm));
            }

            if (matchesSearch && matchesRegion && matchesDivision && matchesStatus) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        if (paginationInfo) {
            paginationInfo.textContent = `Showing 1 to ${visibleCount} of ${visibleCount} entries`;
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterTable);
    }
    
    filterSelects.forEach((select) => {
        select.addEventListener('change', filterTable);
    });

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (searchInput) searchInput.value = '';
            filterSelects.forEach(select => select.selectedIndex = 0);
            filterTable();
        });
    }

    // edit user function
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const editIcon = e.target.closest('.fa-pen-to-square');
            const saveIcon = e.target.closest('.fa-check');
            const cancelIcon = e.target.closest('.fa-xmark');

            if (editIcon) {
                const row = editIcon.closest('tr');
                if (row.classList.contains('editing')) return; // Prevent double click
                
                row.classList.add('editing');
                const cells = row.querySelectorAll('td');

                // 1: First Name, 2: Last Name, 3: Email, 4: Group, 5: Division, 6: Region
                for (let i = 1; i <= 6; i++) {
                    const currentText = cells[i].textContent.trim();
                    // Store original value for canceling later
                    cells[i].setAttribute('data-original', currentText);
                    cells[i].innerHTML = `<input type="text" class="form-control form-control-sm" value="${currentText}">`;
                }

                // Change Action icons: Replace Edit with Save & Cancel
                const actionCell = cells[cells.length - 1];
                actionCell.innerHTML = `
                    <i class="fa-solid fa-check text-success cursor-pointer" title="Save"></i>
                    <i class="fa-solid fa-xmark text-secondary cursor-pointer ms-2" title="Cancel"></i>
                `;
            }

            if (saveIcon) {
                const row = saveIcon.closest('tr');
                const cells = row.querySelectorAll('td');

                for (let i = 1; i <= 6; i++) {
                    const input = cells[i].querySelector('input');
                    if (input) {
                        cells[i].textContent = input.value.trim();
                        cells[i].removeAttribute('data-original');
                    }
                }

                row.classList.remove('editing');

                const actionCell = cells[cells.length - 1];
                actionCell.innerHTML = `
                    <i class="fa-regular fa-pen-to-square text-primary cursor-pointer"></i>
                    <i class="fa-solid fa-ban text-danger cursor-pointer ms-2"></i>
                `;
            }

            if (cancelIcon) {
                const row = cancelIcon.closest('tr');
                const cells = row.querySelectorAll('td');

                for (let i = 1; i <= 6; i++) {
                    const originalText = cells[i].getAttribute('data-original');
                    if (originalText !== null) {
                        cells[i].textContent = originalText;
                        cells[i].removeAttribute('data-original');
                    }
                }

                row.classList.remove('editing');

                const actionCell = cells[cells.length - 1];
                actionCell.innerHTML = `
                    <i class="fa-regular fa-pen-to-square text-primary cursor-pointer"></i>
                    <i class="fa-solid fa-ban text-danger cursor-pointer ms-2"></i>
                `;
            }
        });
    }
});

