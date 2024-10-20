const { expect } = require('chai');
const sinon = require('sinon');
const shell = require('shelljs');
const ora = require('./__mocks__/ora'); // Use the mock version of ora
const {
  installNodeJS,
  installPython,
  installGo,
  installPackageManager
} = require('../lib/installTools');

describe('Install Tools Tests', () => {
  let execStub, whichStub;

  beforeEach(() => {
    execStub = sinon.stub(shell, 'exec'); // Stub shell.exec
    whichStub = sinon.stub(shell, 'which'); // Stub shell.which
    console.log('Stubbing exec and which methods');
  });

  afterEach(() => {
    sinon.restore(); // Restore all stubs after each test
    console.log('Restoring stubs');
  });

  describe('Node.js Installation', () => {
    it('should not install Node.js if it is already installed', () => {
      whichStub.withArgs('node').returns(true); // Simulate Node.js being installed
      console.log('Testing Node.js already installed case');
      installNodeJS();
      expect(whichStub.calledOnceWith('node')).to.be.true;
      expect(execStub.notCalled).to.be.true; // shell.exec shouldn't be called since Node.js is already installed
    });

    it.skip('should install Node.js on Linux if it is not installed', () => {
      whichStub.withArgs('node').returns(false); // Simulate Node.js not being installed
      sinon.stub(process, 'platform').value('linux'); // Mock OS as Linux

      // Simulate successful command execution with a callback
      execStub.onFirstCall().yields(null, 'success', ''); // Simulate first command (setup script)
      execStub.onSecondCall().yields(null, 'success', ''); // Simulate second command (actual install)

      installNodeJS();

      console.log('Testing Node.js not installed case on Linux');
      
      // Ensure that shell.exec is called twice for the installation process
      expect(execStub.callCount).to.equal(2); // Should call the installation commands twice
      expect(execStub.firstCall.args[0]).to.include('nodesource'); // First command (setup Node.js repository)
      expect(execStub.secondCall.args[0]).to.include('apt-get install -y nodejs'); // Second command (install Node.js)
    });

    it('should warn about downloading Node.js manually on Windows', () => {
      whichStub.withArgs('node').returns(false); // Simulate Node.js not installed
      sinon.stub(process, 'platform').value('win32'); // Mock OS as Windows
      console.log('Testing Windows case');
      installNodeJS();
      expect(execStub.notCalled).to.be.true; // No exec should be called since Windows asks for manual installation
    });
  });

  describe('Python Installation', () => {
    it('should not install Python if it is already installed', () => {
      whichStub.withArgs('python3').returns(true); // Simulate Python being installed
      console.log('Testing Python already installed case');
      installPython();
      expect(whichStub.calledOnceWith('python3')).to.be.true;
      expect(execStub.notCalled).to.be.true; // No exec because Python is already installed
    });

    it('should install Python on Linux if it is not installed', () => {
      whichStub.withArgs('python3').returns(false); // Simulate Python not being installed
      sinon.stub(process, 'platform').value('linux'); // Mock OS as Linux
      
      // Simulate successful installation
      execStub.yields(null, 'success', ''); // Simulate successful exec for Python installation
      console.log('Testing Python not installed case on Linux');
      installPython();
      expect(execStub.calledOnce).to.be.true; // Should call the installation command once on Linux
      console.log('Command executed for Python installation:', execStub.firstCall.args[0]); // Log the command
      expect(execStub.firstCall.args[0]).to.include('apt-get install -y python3'); // Check that apt-get command was executed
    });

    it('should warn about downloading Python manually on Windows', () => {
      whichStub.withArgs('python3').returns(false); // Simulate Python not installed
      sinon.stub(process, 'platform').value('win32'); // Mock OS as Windows
      console.log('Testing Windows case for Python');
      installPython();
      expect(execStub.notCalled).to.be.true; // No exec because Python installation is manual on Windows
    });
  });

  describe('Go Installation', () => {
    it('should not install Go if it is already installed', () => {
      whichStub.withArgs('go').returns(true); // Simulate Go being installed
      console.log('Testing Go already installed case');
      installGo();
      expect(whichStub.calledOnceWith('go')).to.be.true;
      expect(execStub.notCalled).to.be.true; // No exec because Go is already installed
    });

    it('should install Go on Linux if it is not installed', () => {
      whichStub.withArgs('go').returns(false); // Simulate Go not being installed
      sinon.stub(process, 'platform').value('linux'); // Mock OS as Linux
      
      // Simulate successful installation
      execStub.yields(null, 'success', ''); // Simulate successful exec for Go installation
      console.log('Testing Go not installed case on Linux');
      installGo();
      expect(execStub.calledOnce).to.be.true; // Should call the installation command once on Linux
      console.log('Command executed for Go installation:', execStub.firstCall.args[0]); // Log the command
      expect(execStub.firstCall.args[0]).to.include('apt-get install -y golang'); // Check that apt-get command was executed
    });

    it('should warn about downloading Go manually on Windows', () => {
      whichStub.withArgs('go').returns(false); // Simulate Go not installed
      sinon.stub(process, 'platform').value('win32'); // Mock OS as Windows
      console.log('Testing Windows case for Go');
      installGo();
      expect(execStub.notCalled).to.be.true; // No exec because Go installation is manual on Windows
    });
  });

  describe('Package Manager Installation', () => {
    it('should install Bun if not installed', () => {
      whichStub.withArgs('bun').returns(false); // Simulate Bun not being installed
      execStub.yields(null, 'success', ''); // Simulate successful installation
      console.log('Testing Bun installation');
      installPackageManager('bun');
      expect(execStub.calledOnce).to.be.true; // Should call the installation command for Bun
      console.log('Command executed for Bun installation:', execStub.firstCall.args[0]); // Log the command
      expect(execStub.firstCall.args[0]).to.include('curl -fsSL https://bun.sh/install'); // Verify the correct install command
    });

    it('should not install Yarn if it is already installed', () => {
      whichStub.withArgs('yarn').returns(true); // Simulate Yarn being installed
      console.log('Testing Yarn already installed case');
      installPackageManager('yarn');
      expect(execStub.notCalled).to.be.true; // No exec because Yarn is already installed
    });
  });
});
