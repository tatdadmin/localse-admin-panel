import { useEffect, useState } from "react"
import { FETCH_ACCESS_BY_EMAIL, GET_ALL_EMPLOYEE, GET_ALL_EMPLOYEE_ACCESS, GIVE_ACCESS_FOR_EMPLOYEE } from "../../apis/Apis"

const EmployeeAccess = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalData, setModalData] = useState([])
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showGiveAccessModal, setShowGiveAccessModal] = useState(false)
    const [allTasks, setAllTasks] = useState([])
    const [taskOrders, setTaskOrders] = useState({})
    
    // Unique loading states
    const [loadingAccess, setLoadingAccess] = useState({}) // For individual "Get Access" buttons
    const [loadingGiveAccess, setLoadingGiveAccess] = useState({}) // For individual "Give Access" buttons
    const [loadingAllAccess, setLoadingAllAccess] = useState(false) // For fetching all tasks
    const [savingAccess, setSavingAccess] = useState(false) // For saving access

    // Check if any loading is active
    const isAnyLoading = () => {
        return loading || 
               Object.values(loadingAccess).some(Boolean) || 
               Object.values(loadingGiveAccess).some(Boolean) || 
               loadingAllAccess || 
               savingAccess
    }

    const getData = async () => {
        try {
            setLoading(true)
            const res = await GET_ALL_EMPLOYEE()
            if (res.status_code === 200) {
                setEmployees(res.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getAccessOfEmployee = async (email, name) => {
        if (!email) {
            alert('Employee email is not available')
            return
        }
        
        try {
            setLoadingAccess(prev => ({ ...prev, [email]: true }))
            setSelectedEmployee({ name, email })
            const res = await FETCH_ACCESS_BY_EMAIL({
                employee_email: email
            })
            
            if (res.status_code === 200) {
                setModalData(res.data)
                setShowModal(true)
            }
        } catch (error) {
            console.log(error)
            alert('Error fetching employee access data')
        } finally {
            setLoadingAccess(prev => ({ ...prev, [email]: false }))
        }
    }

    const getAllAccess = async () => {
        try {
            setLoadingAllAccess(true)
            const res = await GET_ALL_EMPLOYEE_ACCESS()
            if (res.status_code === 200) {
                setAllTasks(res.data)
                setShowGiveAccessModal(true)
                // Reset task orders
                setTaskOrders({})
            }
        } catch (error) {
            console.log(error)
            alert('Error fetching available tasks')
        } finally {
            setLoadingAllAccess(false)
        }
    }

    const handleGiveAccess = async (email, name) => {
        if (!email) {
            alert('Employee email is not available')
            return
        }
        
        setLoadingGiveAccess(prev => ({ ...prev, [email]: true }))
        setSelectedEmployee({ name, email })
        
        try {
            await getAllAccess()
        } finally {
            setLoadingGiveAccess(prev => ({ ...prev, [email]: false }))
        }
    }

    const handleOrderChange = (taskId, order) => {
        const orderNum = parseInt(order)
        
        // Update task orders
        setTaskOrders(prev => ({
            ...prev,
            [taskId]: orderNum || ''
        }))
    }

    const closeGiveAccessModal = () => {
        setShowGiveAccessModal(false)
        setAllTasks([])
        setSelectedEmployee(null)
        setTaskOrders({})
    }

    // Updated function to call the API with actual data
    const giveAccessToEmp = async (employeeEmail, tasksToAssign) => {
        try {
            setSavingAccess(true)
            const res = await GIVE_ACCESS_FOR_EMPLOYEE({
                employee_email: employeeEmail,
                tasks: tasksToAssign
            })
            
            if (res.status_code === 200) {
                alert(`Successfully assigned ${tasksToAssign.length} tasks to ${selectedEmployee.name}`)
                closeGiveAccessModal()
                // Optionally refresh the employee list or their access data
                getData()
            } else {
                alert('Failed to assign access. Please try again.')
            }
        } catch (error) {
            console.log("EERR",error)
            alert(error.message)
            alert('Error occurred while assigning access')
        } finally {
            setSavingAccess(false)
        }
    }

    const handleSaveAccess = () => {
        // Get tasks with valid orders
        const tasksWithOrders = Object.entries(taskOrders)
            .filter(([_, order]) => order !== '' && !isNaN(order))
            .map(([taskId, order]) => {
                const task = allTasks.find(t => t._id === taskId)
                return {
                    task_name: task.task_name,
                    task_url: task.task_url,
                    order: parseInt(order)
                }
            })
        
        if (tasksWithOrders.length === 0) {
            alert('Please assign at least one task with a valid order')
            return
        }

        // Call the API function with actual data
        giveAccessToEmp(selectedEmployee.email, tasksWithOrders)
    }

    const closeModal = () => {
        setShowModal(false)
        setModalData([])
        setSelectedEmployee(null)
    }

    useEffect(() => {
        getData()
    }, [])

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12">
                        <h2 className="mb-4">Employee Access Management</h2>
                        
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <h5 className="card-title mb-0">Employees List</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover mb-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees.map((employee, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>
                                                        <strong>{employee.name}</strong>
                                                    </td>
                                                    <td>
                                                        {employee.email ? (
                                                            <span className="badge bg-success">{employee.email}</span>
                                                        ) : (
                                                            <span className="badge bg-warning text-dark">No Email</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="btn-group" role="group">
                                                            <button
                                                                type="button"
                                                                className="btn btn-info btn-sm me-2"
                                                                onClick={() => getAccessOfEmployee(employee.email, employee.name)}
                                                                disabled={!employee.email || isAnyLoading()}
                                                            >
                                                                {loadingAccess[employee.email] ? (
                                                                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                                                ) : (
                                                                    <i className="bi bi-eye me-1"></i>
                                                                )}
                                                                Get Access
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => handleGiveAccess(employee.email, employee.name)}
                                                                disabled={!employee.email || isAnyLoading()}
                                                            >
                                                                {loadingGiveAccess[employee.email] ? (
                                                                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                                                ) : (
                                                                    <i className="bi bi-plus-circle me-1"></i>
                                                                )}
                                                                Give Access
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Get Access Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    Access Details for {selectedEmployee?.name}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={closeModal}
                                    disabled={isAnyLoading()}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {selectedEmployee && (
                                    <div className="mb-3">
                                        <p className="mb-1">
                                            <strong>Employee:</strong> {selectedEmployee.name}
                                        </p>
                                        <p className="mb-3">
                                            <strong>Email:</strong> {selectedEmployee.email}
                                        </p>
                                    </div>
                                )}
                                
                                {modalData.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Task Name</th>
                                                    <th>Task URL</th>
                                                    <th>Order</th>
                                                    <th>Created At</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {modalData
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((access, index) => (
                                                    <tr key={access._id || index}>
                                                        <td>
                                                            <span className="badge bg-primary">
                                                                {access.task_name}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <code>{access.task_url}</code>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-secondary">
                                                                {access.order}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {new Date(access.createdAt).toLocaleDateString('en-IN', {
                                                                year: 'numeric',
                                                                timeZone: 'UTC',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                                        <h5 className="mt-3">No Access Data Found</h5>
                                        <p className="text-muted">This employee doesn't have any access permissions assigned.</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeModal}
                                    disabled={isAnyLoading()}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Give Access Modal */}
            {showGiveAccessModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">
                                    Give Access to {selectedEmployee?.name}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={closeGiveAccessModal}
                                    disabled={isAnyLoading()}
                                ></button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                {selectedEmployee && (
                                    <div className="mb-4">
                                        <div className="alert alert-info">
                                            <p className="mb-1">
                                                <strong>Employee:</strong> {selectedEmployee.name}
                                            </p>
                                            <p className="mb-0">
                                                <strong>Email:</strong> {selectedEmployee.email}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mb-3">
                                    <div className="alert alert-info">
                                        <small>
                                            <strong>Note:</strong> Assign order numbers to the tasks you want to give access to.
                                        </small>
                                    </div>
                                </div>

                                {allTasks.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Task Name</th>
                                                    <th>Task URL</th>
                                                    <th>Task Purpose</th>
                                                    <th>Order</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allTasks.map((task) => (
                                                    <tr key={task._id}>
                                                        <td>
                                                            <strong>{task.task_name}</strong>
                                                        </td>
                                                        <td>
                                                            <code className="text-primary">{task.task_url}</code>
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">{task.task_purpose}</small>
                                                        </td>
                                                        <td style={{ minWidth: '120px' }}>
                                                            <input
                                                                type="number"
                                                                className={`form-control form-control-sm ${
                                                                    taskOrders[task._id] ? 'is-valid' : ''
                                                                }`}
                                                                placeholder="Order"
                                                                min="1"
                                                                value={taskOrders[task._id] || ''}
                                                                onChange={(e) => handleOrderChange(task._id, e.target.value)}
                                                                disabled={isAnyLoading()}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : loadingAllAccess ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading tasks...</span>
                                        </div>
                                        <p className="mt-2">Loading available tasks...</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                                        <h5 className="mt-3">No Tasks Available</h5>
                                        <p className="text-muted">No tasks are available to assign.</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeGiveAccessModal}
                                    disabled={isAnyLoading()}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleSaveAccess}
                                    disabled={Object.keys(taskOrders).length === 0 || isAnyLoading()}
                                >
                                    {savingAccess ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-1"></i>
                                            Save Access
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default EmployeeAccess