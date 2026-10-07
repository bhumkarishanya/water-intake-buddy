import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';
import WaterEntryForm from '../components/WaterEntryForm.jsx';

export default function AddWater() {
  const navigate = useNavigate();
  const toast = useToast();

  const submit = async (values) => {
    try {
      await api.post('/water', values);
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
    toast.show(`Added ${values.amount} ml`);
    navigate('/');
  };

  return (
    <div className="page narrow">
      <h1>Add Water</h1>
      <p className="muted">Log a drink for now or back-date an entry.</p>
      <div className="card">
        <WaterEntryForm onSubmit={submit} submitLabel="Add Water" />
      </div>
    </div>
  );
}
