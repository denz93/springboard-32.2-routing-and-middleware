((window, doc) => {
  window.addEventListener('load', onWindowReady)
  let itemList = []

  /**
   * 
   * @param {string} message 
   * @param {"warning"|"success"|"danger"} type 
   */
  async function bsAlert(message, type = 'danger') {
    if (!bsAlert._alertContainerEle) {
      const ele = doc.createElement('div')
      ele.classList.add(..."position-fixed top-0 end-0 p-3".split(" "))
      bsAlert._alertContainerEle = ele
      doc.body.append(ele)
    }
    const alertEle = doc.createElement('div')
    alertEle.classList.add('alert', `alert-${type}`, 'alert-dismissible')
    alertEle.setAttribute('role', 'alert')
    alertEle.innerHTML = `
      <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `
    bsAlert._alertContainerEle.append(alertEle)
    setTimeout(() => {
      alertEle.remove()
    }, 5000)  
  }
  async function onWindowReady() {
    itemList = await fetchItems()
    renderItemList(itemList)

    /** @type {HTMLFormElement} */
    let form = doc.querySelector('#create-item-form')
    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      const btn = form.querySelector('button[type="submit"]')
      let name = form.querySelector('input[type="text"]').value
      let price = form.querySelector('input[type="number"]').value
      btn.setAttribute('disabled', 'disabled')
      try {
        const item = await createItem({name, price})
        itemList.push(item)
        renderItemList(itemList)
        form.reset()
        btn.removeAttribute('disabled')
      } catch (err) {
        console.log({err})
        btn.removeAttribute('disabled')
        bsAlert(err.message)
      }
    })

    /**
     * handle update modal
     */
    const modal = doc.querySelector('#update-modal')
    modal.querySelector('button[name=update]').addEventListener('click', async (event) => {
      const name = modal.querySelector('input[name="name"]').value
      const price = modal.querySelector('input[name="price"]').value
      try {
        const item = await updateItem({name, price})
        const itemIndex = itemList.findIndex(i => i.name === item.name)
        itemList[itemIndex] = item
        renderItemList(itemList)
        bsAlert(`Update "${item.name}" success`, 'success')
      } catch (err) {
        bsAlert(err.message, 'danger')
      }

    })
  }

  /**
   * 
   * @param {import("../features/shopping-list/list.model.mjs").ShoppingItem} item 
   */
  async function createItem(item) {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
    const data = await response.json()
    if (response.status === 200) {
      return data.added
    }
    if (response.status >= 400) {
      throw new Error(data.error)
    }
  }

  async function fetchItems() {
    const response = await fetch('/api/items')
    const data = await response.json()
    return data.items
  }

  async function deleteItem(name) {
    const res = await fetch(`/api/items/${name}`, {
      method: 'DELETE',

    })
  }

  async function updateItem(item) {
    const response = await fetch(`/api/items/${item.name}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
    const data = await response.json()
    if (response.status === 200) {
      return data.updated
    }
    if (response.status >= 400) {
      throw new Error(data.error)
    }
  }

  /**
   * 
   * @param {import("../features/shopping-list/list.model.mjs").ShoppingItem[]} items 
   */
  function renderItemList(items) {
    const list = doc.querySelector('#item-list')
    list.innerHTML = ''
    items.forEach(item => {
      const div = doc.createElement('div')
      div.classList.add('p-2', 'd-flex', 'gap-2', 'align-items-center')
      div.innerHTML = `
        <div class="border border-dark-subtle p-2 d-flex gap-1" style="width: 200px">
          <span>${item.name}</span>
          <span>$${item.price}</span>
        </div>
        <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#update-modal">
          <svg id="i-edit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M30 7 L25 2 5 22 3 29 10 27 Z M21 6 L26 11 Z M5 22 L10 27 Z" />
          </svg>
        </button>
        <button class="btn btn-outline-danger btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M2 30 L30 2 M30 30 L2 2" />
          </svg>
        </button>
      `
      list.appendChild(div)

      div.querySelector('button:nth-of-type(2)').addEventListener('click', () => {
        deleteItem(item.name)
        itemList = itemList.filter(i => i.name !== item.name)
        renderItemList(itemList)
      })

      div.querySelector('button:nth-of-type(1)').addEventListener('click', () => {
        const modal = doc.querySelector('#update-modal')
        modal.querySelector('#updateModalLabel').textContent = `Update item "${item.name}"`
        modal.querySelector('input[name="name"]').value = item.name
        modal.querySelector('input[name="price"]').value = item.price
      })
      
    })
  }

})(window, document)
