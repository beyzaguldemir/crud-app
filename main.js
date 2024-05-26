//! gerekli olan html elementleri
const form=document.querySelector(".grocery-form");
const grocery=document.getElementById("grocery");
const container=document.querySelector(".grocery-container");
const list=document.querySelector(".grocery-list");
const submitBtn=document.querySelector(".submit-btn")
const alert=document.querySelector(".alert")
const clearBtn=document.querySelector(".clear-btn")


//*düzenleme değiskenleri
let editElement;
let editFlag=false;//Düzenleme modunda olup olmadıgını belirtir
let editID="";//Düzenleme yapılan elemanın benzersiz kimligi
//!Fonksiyonlar

const setBackToDefault=()=>{
    grocery.value=""
    editFlag=false
    editID=""
    submitBtn.textContent="Ekle"
}
const displayAlert=(text,action)=>{
    alert.textContent=text
    alert.classList.add(`alert-${action}`)
    setTimeout(()=>{
        alert.textContent=""
        alert.classList.remove(`alert-${action}`)
    },2000)
}

const deleteItem= (e) => {
    const element =e.currentTarget.parentElement.parentElement;//currentTarget tıkladıgımız butonu getirmeye yarıyor article etiketine eristik
    const id=element.dataset.id
    list.removeChild(element)//list etiketi icerisinden article etiketini kaldırdık
    displayAlert("Öge Kaldırıldı","danger")
    setBackToDefault()
    grocery.focus()
    removeFromLocalStorage(id)
};

const editItem=(e)=>{
    const element=e.currentTarget.parentElement.parentElement
    editElement=e.currentTarget.parentElement.previousElementSibling;
    
    //article etiketinin icerisindeki p elementinin icindeki text i inputun icine gonderdik
    grocery.value=editElement.innerText
    editFlag=true
    editID=element.dataset.id
    submitBtn.textContent="Düzenle"//Düzenleme isleminde submitBTn in icerigini degistirdik
    grocery.focus()

}

const addItem=(e)=>{
    e.preventDefault();//formun otomatik olarak gönderilmesini engeller
    const value=grocery.value;//form içerisinde olusan id nin degerini aldık
    const id=new Date().getTime().toString();//benzersiz bir id olusturduk
   
    if(value!=="" && !editFlag){
        const element=document.createElement("article")//yeni bir article etiketi olusturduk
        let attr=document.createAttribute("data-id");//olusturulan article icin degisken olusturduk data-id="8773726" gibi
        attr.value=id;
        element.setAttributeNode(attr)//olusturulan degiskeni elemente ekledik 
        element.classList.add("grocery-item");//olusturdugumuz article etiketine class ekledik
        element.innerHTML=`
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
            <button type="button" class="delete-btn"><i class="fa-solid fa-trash"></i></button>

        </div>
        `
        const deleteBtn=element.querySelector(".delete-btn")
        deleteBtn.addEventListener("click", deleteItem);

        const editBtn=element.querySelector(".edit-btn")
        editBtn.addEventListener("click",editItem)
            
        
        //kapsayıcıya olusturdugumuz article etiketini ekledik
        list.appendChild(element);
        displayAlert("Başarıyla Eklendi","success");

        container.classList.add("show-container")
        //localStorage e ekleme
        addToLocalStorage(id, value);
        //Degerleri varsayılana cevirir
        
        setBackToDefault()
    }
    else if(value!=="" && editFlag){
        //kullanıcının inputa girdigi degeri gonderdik (p ye gonderdik)
        editElement.innerText=value
        //alert vermesini sagladik
        displayAlert("Değer Değiştirildi","success")
        editLocalStorage(editID, value)
        setBackToDefault();

    }
    
    

}
const clearItems=()=>{
    const items=document.querySelectorAll(".grocery-item")
    //listede eleman varsa calisir
    if(items.length>0){
        items.forEach((item)=>list.removeChild(item))
    }
    //container yapisini gizle
    container.classList.remove("show-container")
    displayAlert("Liste Temizlendi","danger")
    
    setBackToDefault()
    
}
const createListItem=(id,value)=>{
    const element=document.createElement("article")//yeni bir article etiketi olusturduk
        let attr=document.createAttribute("data-id");//olusturulan article icin degisken olusturduk data-id="8773726" gibi
        attr.value=id;
        element.setAttributeNode(attr)//olusturulan degiskeni elemente ekledik 
        element.classList.add("grocery-item");//olusturdugumuz article etiketine class ekledik
        element.innerHTML=`
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
            <button type="button" class="delete-btn"><i class="fa-solid fa-trash"></i></button>

        </div>
        `
        const deleteBtn=element.querySelector(".delete-btn")
        deleteBtn.addEventListener("click", deleteItem);

        const editBtn=element.querySelector(".edit-btn")
        editBtn.addEventListener("click",editItem)
            
        
        //kapsayıcıya olusturdugumuz article etiketini ekledik
        list.appendChild(element);
        

        container.classList.add("show-container")
        

}
const setUpItems=()=>{
    let items=getLocalStorage();
    if (items.length>0){
        items.forEach((item)=>{
            createListItem(item.id , item.value)
        })

    }
}
//! olay izleyicileri
form.addEventListener("submit",addItem);
clearBtn.addEventListener("click",clearItems)
window.addEventListener("DOMContentLoaded", setUpItems)

//local storage
const addToLocalStorage = (id, value) => {
    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    console.log(items);
    localStorage.setItem("list", JSON.stringify(items));
  };
  // yerel depodan öğeleri alma işlemi
  const getLocalStorage = () => {
    return localStorage.getItem("list")
      ? JSON.parse(localStorage.getItem("list"))
      : [];
  };
//LocalStorageten veriyi silme
const removeFromLocalStorage=(id)=>{
    //Local storageten verileri getir
    let items =getLocalStorage();
    //Tıkladıgım etiketin id si ve localstorageteki id esit degilse bunu listeden cıkar
    items=items.filter((item)=>{if(item.id!==id){
        return item
    }
})
console.log(items)
localStorage.setItem("list",JSON.stringify(items))
}
//yerel depoda update islemi
const editLocalStorage=(id, value)=>{
    let items=getLocalStorage()
    //yerel depodaki verilerin id ise güncellenecek verinin id si esitse inputta ki value al
    //localstorage ta verinin value suna aktar
    items=items.map((item)=>{if(item.id===id){
        item.value=value
    }
    return item;
})
   localStorage.setItem("list",JSON.stringify(items))

}