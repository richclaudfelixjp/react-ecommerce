import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <h1>cloudjp E-commerce</h1>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default App;