import { useAuth } from '../context/AuthContext'
import { deleteEmployee, getAllEmployees } from '../api/axios';
import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query';
import '../styles/HomePage.css'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const queryClient = useQueryClient();
  const { jwtToken } = useAuth();

  const navigate = useNavigate();
  const { isLoading, isError, data: employees} = useQuery({
    queryKey: ['employeesData'],
    queryFn: () => getAllEmployees(jwtToken),
    enabled: !!jwtToken
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: ({ id }) => deleteEmployee(id, jwtToken),
    onSuccess: () => {
      queryClient.invalidateQueries('employeesData');
    },
    onError: (error) => {
      if(error?.response?.status === 403) toast.error('Istifadəçini silməyə səlahiyyətiniz çatmır',{duration:1000})
    }
  });

  const handleUpdate = (employeeId) => {
    navigate(`/update/${employeeId}`);
  }

  const handleDelete = (employeeId) => {
    deleteEmployeeMutation.mutate({ id: employeeId });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="grid-container">
      {employees && employees.length > 0 ? (
        employees.map((employee, index) => (
          <div key={index} className="employee-card">
            <div>
              <strong>Ad:</strong> {employee.firstName}
            </div>
            <div>
              <strong>Soyad:</strong> {employee.lastName}
            </div>
            <div>
              <strong>Rütbə:</strong> {employee.rank.name}
            </div>
            <div>
              <strong>Vəzifə:</strong> {employee.position.name}
            </div>
            <div>
              <strong>Şöbə:</strong> {employee.department.name}
            </div>
            <div className='employee-card-button-container'>
              <button onClick={() => handleUpdate(employee.id)}>Update</button>
              <button onClick={() => handleDelete(employee.id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <div>No employees found.</div>
      )}
    </div>
  );
};

export default HomePage;