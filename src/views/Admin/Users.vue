<template>

    <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">Users</h3>
            <div class="muted-small">As this is a static demo there is no live data.</div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <div class="card stat text-center">
                <div class="muted-small">Total Orders</div>
                <div class="h4 mt-2">128</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card stat text-center">
                <div class="muted-small">Revenue (YTD)</div>
                <div class="h4 mt-2">$14,520</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card stat text-center">
                <div class="muted-small">Active Customers</div>
                <div class="h4 mt-2">342</div>
              </div>
            </div>
          </div>



          <div class="card mb-4" v-if="showForm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">{{ editId ? 'Update' : 'Create' }} user</h5>
              </div>

              <form @submit.prevent="handleSubmit">

              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input 
                  class="form-control"
                  v-model="form.name"
                  >
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  class="form-control"
                  v-model="form.email"
                  >
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password"
                  class="form-control"
                  v-model="form.password"
                  >
              </div>

              <button type="submit" class="btn btn-primary">{{ editId ? 'Update' : 'Create' }}</button>
              <button type="button" class="btn btn-info" @click="closeCreateForm">Close</button>
            </form>

              </div>
            </div>


          





          <!-- Orders list (static) -->
          <div class="card mb-4" id="orders">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">Recent Orders</h5>
                <button type="button" @click="showUserCreateForm">Create User</button>
              </div>

              <div class="table-responsive">
                <table class="table table-hover align-middle">
                  <thead class="table-light">
                    <tr>
                      <th>Sl</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="users.length > 0" v-for="user in users" :key="user.id">
                      <td>{{ user.id }}</td>
                      <td>{{ user.name }}</td>
                      <td>{{ user.email }}</td>
                      <td>

                        <button type="button" class="btn btn-sm btn-primary" @click="editUser(user)">Edit</button>
                        <button v-if="auth.user.id !== user.id" type="button" class="btn btn-sm btn-danger" @click="userDelete(user)">Delete</button>

                      </td>
                    </tr>
                    
                    <tr v-if="users.length === 0">
                      <td color="4"> No Users found</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>

</template>


<script setup>

import { ref, onMounted } from 'vue';
import http from '../../lib/http';
import { toast } from 'vue3-toastify';
import { useAuth } from '../../stores/auth';


const users = ref([])
const showForm = ref(false)
const editId = ref('')
const auth = useAuth()

const form = ref({
    name: '',
    email: '',
    role: '',
    password: '',
})

const showUserCreateForm = async () =>{
  showForm.value = true
  form.value = {
      name: '',
      email: '',
      role: '',
      password: '',
  }
}

const closeCreateForm = async () =>{
  editId.value = '' 
  showForm.value = false 
  form.value = {
      name: '',
      email: '',
      role: '',
      password: '',
  }

}

const editUser = (user) => {
  editId.value = user.id 
  showForm.value = true 
  form.value = {
      name: user.name,
      email: user.email,
  }
}

const loadUsers = async () =>{
    const response = await http.get('users')
    users.value = response.data?.data ?? []
}

const handleSubmit = async () => {

    if(editId.value){

      const userEditId = editId.value
      const payload = {
        name: form.value.name,
        email: form.value.email,
        role: form.value.role,
        password: form.value.password,
      }


      const response = await http.put(`users/${userEditId}`, payload)

      toast.success('User updated successfully')

      const updatedUser = response.data?.data.user ?? null

      if(updatedUser){
          
        const idX = users.value.findIndex( u => u.id ===  updatedUser.id)

          if(idX !== -1 ){

              users.value[idX] = updatedUser

          }
      }

      closeCreateForm()


    }else{

      const payload = {
        name: form.value.name,
        email: form.value.email,
        role: form.value.role,
        password: form.value.password,
      }


      const response = await http.post('users', payload)

      toast.success('User created successfully')

      const newUser = response.data?.data.user ?? null

      if(newUser){
          users.value.push(newUser)
      }

    }
    
}


const userDelete = async (user) => {

    
    if(!confirm('are you sure to delete?'))
    {
      return
    }

    const deleteId = user.id 

    const response = await http.delete(`users/${deleteId}`)

    users.value = users.value.filter(u => u.id != user.id)

    toast.success('User Deleted Successfully')

}



onMounted(() => {

    loadUsers();

})

</script>