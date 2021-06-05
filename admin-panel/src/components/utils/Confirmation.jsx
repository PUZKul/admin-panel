

 const Confirmation = function(action){
    return(
        <div className="modal fade" id="confirmId" tabindex="-1" aria-labelledby="confirmIdLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="confirmIdLabel">Confirm</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            Do you confirm this action?
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => action()}>Confirm</button>
            </div>
            </div>
        </div>
        </div>
    )
}

export default Confirmation;






