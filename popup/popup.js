let tabs = [];
const groupTabsBtn = document.querySelector('.group-tabs-btn')
groupTabsBtn.addEventListener('click', groupTabs)

function focusOnTab(tabId) {
    chrome.tabs.update(tabId, { active: true })
}

async function groupTabs () {
    const groups = {};
    
    for (const tab of tabs) {
        const host = new URL(tab.url).host

        if (groups[host]) {
            groups[host].push(tab)
        } else {
            groups[host] = [tab]
        }
    }

    for (const [host, tabItems] of Object.entries(groups)) {
        const tabIds = tabItems.map(tab => tab.id)
        const group = await chrome.tabs.group({tabIds: tabIds})
        await chrome.tabGroups.update(group, { title: host })
    }
}

const listTabs = async () => {
    tabs = await chrome.tabs.query({})
    const tabsContainer = document.querySelector('.tabs')

    for (const tab of tabs) {
        const button = document.createElement('button')
        button.classList.add('tab')
        button.innerText = tab.title.slice(0, 50)
        button.addEventListener('click', () => focusOnTab(tab.id))
        tabsContainer.appendChild(button)
    }
    
    console.log(tabs)
}


listTabs()